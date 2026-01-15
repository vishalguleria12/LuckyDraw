import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export interface TokenTransaction {
  id: string;
  user_id: string;
  amount: number;
  transaction_type: string;
  description: string | null;
  draw_id: string | null;
  payment_status: string | null;
  created_at: string;
}

export const useTokenTransactions = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["tokenTransactions", user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from("token_transactions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as TokenTransaction[];
    },
    enabled: !!user,
  });
};

export const usePurchaseTokens = () => {
  const queryClient = useQueryClient();
  const { user, refreshProfile } = useAuth();

  return useMutation({
    mutationFn: async (amount: number) => {
      if (!user) throw new Error("Must be logged in");

      // Get current balance
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("token_balance")
        .eq("user_id", user.id)
        .single();

      if (profileError) throw profileError;

      // Update balance
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ token_balance: (profile?.token_balance || 0) + amount })
        .eq("user_id", user.id);

      if (updateError) throw updateError;

      // Record transaction
      const { error: txError } = await supabase
        .from("token_transactions")
        .insert({
          user_id: user.id,
          amount: amount,
          transaction_type: "purchase",
          description: `Purchased ${amount} tokens`,
          payment_status: "completed",
        });

      if (txError) throw txError;

      return true;
    },
    onSuccess: (_, amount) => {
      queryClient.invalidateQueries({ queryKey: ["tokenTransactions"] });
      refreshProfile();
      toast.success(`Successfully purchased ${amount} tokens!`);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to purchase tokens");
    },
  });
};
