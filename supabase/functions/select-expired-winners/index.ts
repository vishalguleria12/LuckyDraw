import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    )

    console.log("Checking for expired draws that need winner selection...")

    // Find expired draws that need winner selection
    const { data: expiredDraws, error: fetchError } = await supabase
      .from("draws")
      .select("id, prize_name, current_entries")
      .eq("status", "active")
      .is("winner_id", null)
      .lt("ends_at", new Date().toISOString())

    if (fetchError) {
      console.error("Error fetching expired draws:", fetchError)
      return new Response(
        JSON.stringify({ error: fetchError.message }), 
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log(`Found ${expiredDraws?.length || 0} expired draws to process`)

    const results = []
    
    for (const draw of expiredDraws || []) {
      console.log(`Processing draw: ${draw.prize_name} (${draw.id}) with ${draw.current_entries} entries`)
      
      if (draw.current_entries > 0) {
        // Select random winner using the existing RPC function
        const { data: winnerId, error: winnerError } = await supabase.rpc("select_draw_winner", { 
          draw_id: draw.id 
        })
        
        if (winnerError) {
          console.error(`Error selecting winner for ${draw.prize_name}:`, winnerError)
          results.push({ 
            draw: draw.prize_name, 
            drawId: draw.id,
            winner: null, 
            error: winnerError.message 
          })
        } else {
          console.log(`Winner selected for ${draw.prize_name}: ${winnerId}`)
          results.push({ 
            draw: draw.prize_name, 
            drawId: draw.id,
            winnerId: winnerId,
            success: true 
          })
        }
      } else {
        // No entries - just mark as completed with no winner
        const { error: updateError } = await supabase
          .from("draws")
          .update({ status: "completed" })
          .eq("id", draw.id)
        
        if (updateError) {
          console.error(`Error updating draw ${draw.prize_name}:`, updateError)
          results.push({ 
            draw: draw.prize_name, 
            drawId: draw.id,
            winner: null, 
            error: updateError.message 
          })
        } else {
          console.log(`Draw ${draw.prize_name} completed with no entries`)
          results.push({ 
            draw: draw.prize_name, 
            drawId: draw.id,
            winner: null, 
            message: "Completed with no entries" 
          })
        }
      }
    }

    console.log(`Processed ${results.length} draws`)

    return new Response(
      JSON.stringify({ 
        processed: results.length, 
        results,
        timestamp: new Date().toISOString()
      }), 
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    console.error("Unexpected error:", error)
    return new Response(
      JSON.stringify({ error: errorMessage }), 
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
