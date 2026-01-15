import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface PrizeEmailRequest {
  winnerEmail: string;
  winnerName: string;
  prizeName: string;
  prizeCode: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { winnerEmail, winnerName, prizeName, prizeCode }: PrizeEmailRequest = await req.json();

    console.log(`Sending prize email to ${winnerEmail} for ${prizeName}`);

    if (!winnerEmail) {
      throw new Error("Winner email is required");
    }

    const emailResponse = await resend.emails.send({
      from: "Prizes <onboarding@resend.dev>",
      to: [winnerEmail],
      subject: `🎉 Congratulations! Your ${prizeName} Prize is Ready!`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f5;">
            <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
              <div style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); border-radius: 16px 16px 0 0; padding: 40px; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 28px;">🎉 You Won!</h1>
                <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">Congratulations, ${winnerName || 'Winner'}!</p>
              </div>
              
              <div style="background: white; padding: 40px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                <h2 style="color: #18181b; margin: 0 0 20px 0; font-size: 20px;">Your Prize: ${prizeName}</h2>
                
                <div style="background: #f4f4f5; border-radius: 12px; padding: 24px; text-align: center; margin: 24px 0;">
                  <p style="color: #71717a; margin: 0 0 8px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Your Prize Code</p>
                  <p style="color: #18181b; margin: 0; font-size: 24px; font-weight: bold; font-family: monospace; background: white; padding: 16px; border-radius: 8px; border: 2px dashed #d4d4d8;">${prizeCode}</p>
                </div>
                
                <div style="border-top: 1px solid #e4e4e7; margin-top: 24px; padding-top: 24px;">
                  <h3 style="color: #18181b; margin: 0 0 12px 0; font-size: 16px;">How to Redeem</h3>
                  <ol style="color: #52525b; margin: 0; padding-left: 20px; line-height: 1.8;">
                    <li>Copy your prize code above</li>
                    <li>Visit the redemption page for ${prizeName}</li>
                    <li>Enter your code and enjoy your prize!</li>
                  </ol>
                </div>
                
                <p style="color: #71717a; margin: 24px 0 0 0; font-size: 14px; text-align: center;">
                  You can also view your prize anytime on your dashboard.
                </p>
              </div>
              
              <p style="color: #a1a1aa; font-size: 12px; text-align: center; margin-top: 24px;">
                © ${new Date().getFullYear()} Prize Draw. All rights reserved.
              </p>
            </div>
          </body>
        </html>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-prize-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
