import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const useRealtimePrizes = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel("user-prizes-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "prizes",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          console.log("Prize update received:", payload);
          // Invalidate prizes query to refetch
          queryClient.invalidateQueries({ queryKey: ["userPrizes", user.id] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, queryClient]);
};
