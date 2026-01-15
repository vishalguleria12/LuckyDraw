import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export const useIsAdmin = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ["isAdmin", user?.id],
    queryFn: async () => {
      if (!user) return false;
      
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();
      
      if (error) {
        console.error("Error checking admin status:", error);
        return false;
      }
      
      return !!data;
    },
    enabled: !!user,
  });
};

export const useAllDraws = () => {
  const { data: isAdmin } = useIsAdmin();
  
  return useQuery({
    queryKey: ["adminDraws"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("draws")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: isAdmin,
  });
};

export const useAllEntries = (drawId?: string) => {
  const { data: isAdmin } = useIsAdmin();
  
  return useQuery({
    queryKey: ["adminEntries", drawId],
    queryFn: async () => {
      let query = supabase
        .from("draw_entries")
        .select("*, profiles!inner(username, email)")
        .order("created_at", { ascending: false });
      
      if (drawId) {
        query = query.eq("draw_id", drawId);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    enabled: isAdmin,
  });
};

export const useAllPrizes = () => {
  const { data: isAdmin } = useIsAdmin();
  
  return useQuery({
    queryKey: ["adminPrizes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("prizes")
        .select("*, profiles!inner(username, email)")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: isAdmin,
  });
};

export const useCreateDraw = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (draw: {
      prize_name: string;
      prize_subtitle?: string;
      prize_emoji?: string;
      prize_type: string;
      prize_code?: string;
      token_cost: number;
      max_entries: number;
      ends_at: string;
      starts_at?: string;
      status: string;
    }) => {
      const { data, error } = await supabase
        .from("draws")
        .insert(draw)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminDraws"] });
      queryClient.invalidateQueries({ queryKey: ["draws"] });
      toast.success("Draw created successfully!");
    },
    onError: (error) => {
      toast.error("Failed to create draw: " + error.message);
    },
  });
};

export const useUpdateDraw = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: {
      id: string;
      prize_name?: string;
      prize_subtitle?: string;
      prize_emoji?: string;
      prize_type?: string;
      prize_code?: string;
      token_cost?: number;
      max_entries?: number;
      ends_at?: string;
      starts_at?: string;
      status?: string;
    }) => {
      const { data, error } = await supabase
        .from("draws")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminDraws"] });
      queryClient.invalidateQueries({ queryKey: ["draws"] });
      toast.success("Draw updated successfully!");
    },
    onError: (error) => {
      toast.error("Failed to update draw: " + error.message);
    },
  });
};

export const useDeleteDraw = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (drawId: string) => {
      const { error } = await supabase
        .from("draws")
        .delete()
        .eq("id", drawId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminDraws"] });
      queryClient.invalidateQueries({ queryKey: ["draws"] });
      toast.success("Draw deleted successfully!");
    },
    onError: (error) => {
      toast.error("Failed to delete draw: " + error.message);
    },
  });
};

export const useSelectWinner = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (drawId: string) => {
      const { data, error } = await supabase
        .rpc("select_draw_winner", { draw_id: drawId });
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminDraws"] });
      queryClient.invalidateQueries({ queryKey: ["adminPrizes"] });
      queryClient.invalidateQueries({ queryKey: ["draws"] });
      toast.success("Winner selected successfully!");
    },
    onError: (error) => {
      toast.error("Failed to select winner: " + error.message);
    },
  });
};

export const useDeliverPrize = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      prizeId, 
      deliveryCode,
      winnerEmail,
      winnerName,
      prizeName 
    }: { 
      prizeId: string; 
      deliveryCode?: string;
      winnerEmail?: string;
      winnerName?: string;
      prizeName?: string;
    }) => {
      // First, mark the prize as delivered
      const { error } = await supabase
        .rpc("deliver_prize", { 
          prize_id: prizeId, 
          delivery_code: deliveryCode || null 
        });
      
      if (error) throw error;

      // Then send email notification if we have the winner's email
      if (winnerEmail && prizeName && deliveryCode) {
        try {
          const { error: emailError } = await supabase.functions.invoke("send-prize-email", {
            body: {
              winnerEmail,
              winnerName: winnerName || "Winner",
              prizeName,
              prizeCode: deliveryCode,
            },
          });
          
          if (emailError) {
            console.error("Failed to send prize email:", emailError);
            // Don't throw - prize is delivered, email is secondary
          }
        } catch (emailErr) {
          console.error("Error sending prize email:", emailErr);
          // Don't throw - prize is delivered, email is secondary
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminPrizes"] });
      toast.success("Prize delivered and email sent to winner!");
    },
    onError: (error) => {
      toast.error("Failed to deliver prize: " + error.message);
    },
  });
};
