import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface Prize {
  id: string;
  user_id: string;
  draw_id: string;
  prize_name: string;
  prize_code: string | null;
  status: string;
  delivered_at: string | null;
  created_at: string;
}

export const useUserPrizes = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["userPrizes", user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from("prizes")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Prize[];
    },
    enabled: !!user,
  });
};
