import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useRealtimeActiveDraw = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel("realtime-draws")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "draws",
        },
        (payload) => {
          console.log("Realtime draw update:", payload);
          queryClient.invalidateQueries({ queryKey: ["activeDraw"] });
          queryClient.invalidateQueries({ queryKey: ["draws"] });
          queryClient.invalidateQueries({ queryKey: ["upcomingDraws"] });
        }
      )
      .subscribe((status) => {
        console.log("Draws realtime subscription status:", status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);
};

export const useRealtimeUserEntries = (userId: string | undefined) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel(`realtime-user-entries-${userId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "draw_entries",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          console.log("Realtime user entry update:", payload);
          queryClient.invalidateQueries({ queryKey: ["userEntries", userId] });
        }
      )
      .subscribe((status) => {
        console.log("User entries realtime subscription status:", status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient, userId]);
};
