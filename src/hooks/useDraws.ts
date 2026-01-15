import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useEffect } from "react";

export interface Draw {
  id: string;
  prize_name: string;
  prize_subtitle: string | null;
  prize_emoji: string | null;
  prize_type: string;
  token_cost: number;
  max_entries: number;
  current_entries: number;
  status: string;
  starts_at: string | null;
  ends_at: string;
  winner_id: string | null;
  winner_username: string | null;
  created_at: string;
}

export interface DrawEntry {
  id: string;
  draw_id: string;
  user_id: string;
  entries_count: number;
  created_at: string;
}

export const useDraws = () => {
  return useQuery({
    queryKey: ["draws"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("draws")
        .select("*")
        .order("ends_at", { ascending: true });

      if (error) throw error;
      return data as Draw[];
    },
  });
};

export const useActiveDraw = () => {
  return useQuery({
    queryKey: ["activeDraw"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("draws")
        .select("*")
        .eq("status", "active")
        .order("ends_at", { ascending: true })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return data as Draw | null;
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });
};

export const useUpcomingDraws = () => {
  return useQuery({
    queryKey: ["upcomingDraws"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("draws")
        .select("*")
        .eq("status", "upcoming")
        .order("ends_at", { ascending: true })
        .limit(3);

      if (error) throw error;
      return data as Draw[];
    },
  });
};

export const useCompletedDraws = () => {
  return useQuery({
    queryKey: ["completedDraws"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("draws")
        .select("*")
        .eq("status", "completed")
        .order("ends_at", { ascending: false })
        .limit(10);

      if (error) throw error;
      return data as Draw[];
    },
  });
};

export const useUserEntries = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["userEntries", user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from("draw_entries")
        .select("*")
        .eq("user_id", user.id);

      if (error) throw error;
      return data as DrawEntry[];
    },
    enabled: !!user,
  });
};

export const useEnterDraw = () => {
  const queryClient = useQueryClient();
  const { user, refreshProfile } = useAuth();

  return useMutation({
    mutationFn: async ({ 
      drawId, 
      tokenCost, 
      entriesCount = 1 
    }: { 
      drawId: string; 
      tokenCost: number; 
      entriesCount?: number;
    }) => {
      if (!user) throw new Error("Must be logged in");

      const totalCost = tokenCost * entriesCount;

      // Check if user has enough tokens
      const { data: profile } = await supabase
        .from("profiles")
        .select("token_balance")
        .eq("user_id", user.id)
        .single();

      if (!profile || profile.token_balance < totalCost) {
        throw new Error("Insufficient tokens");
      }

      // Start a transaction-like operation
      // 1. Deduct tokens from user
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ token_balance: profile.token_balance - totalCost })
        .eq("user_id", user.id);

      if (updateError) throw updateError;

      // 2. Create or update entry
      const { data: existingEntry } = await supabase
        .from("draw_entries")
        .select("*")
        .eq("draw_id", drawId)
        .eq("user_id", user.id)
        .maybeSingle();

      if (existingEntry) {
        const { error: entryError } = await supabase
          .from("draw_entries")
          .update({ entries_count: existingEntry.entries_count + entriesCount })
          .eq("id", existingEntry.id);

        if (entryError) throw entryError;
      } else {
        const { error: entryError } = await supabase
          .from("draw_entries")
          .insert({
            draw_id: drawId,
            user_id: user.id,
            entries_count: entriesCount,
          });

        if (entryError) throw entryError;
      }

      // 3. Record transaction
      const { error: txError } = await supabase
        .from("token_transactions")
        .insert({
          user_id: user.id,
          amount: -totalCost,
          transaction_type: "spend",
          description: entriesCount > 1 ? `Draw entry (x${entriesCount})` : "Draw entry",
          draw_id: drawId,
        });

      if (txError) throw txError;

      return entriesCount;
    },
    onSuccess: (entriesCount: number) => {
      // Invalidate all relevant queries for immediate UI update
      queryClient.invalidateQueries({ queryKey: ["draws"] });
      queryClient.invalidateQueries({ queryKey: ["activeDraw"] });
      queryClient.invalidateQueries({ queryKey: ["upcomingDraws"] });
      queryClient.invalidateQueries({ queryKey: ["userEntries", user?.id] });
      refreshProfile();
      toast.success(
        entriesCount > 1 
          ? `Successfully entered with ${entriesCount} entries!` 
          : "Successfully entered the draw!"
      );
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to enter draw");
    },
  });
};
