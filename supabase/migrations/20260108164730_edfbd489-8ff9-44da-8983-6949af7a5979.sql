-- Ensure draw_entries changes update draws.current_entries
-- Create trigger if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_trigger
    WHERE tgname = 'trg_update_draw_entry_count'
  ) THEN
    CREATE TRIGGER trg_update_draw_entry_count
    AFTER INSERT OR UPDATE OR DELETE ON public.draw_entries
    FOR EACH ROW
    EXECUTE FUNCTION public.update_draw_entry_count();
  END IF;
END $$;

-- RLS: allow users to update their own draw_entries (needed for multi-entry)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'draw_entries'
      AND policyname = 'Users can update their own entries'
  ) THEN
    CREATE POLICY "Users can update their own entries"
    ON public.draw_entries
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'draw_entries'
      AND policyname = 'Admins can update all entries'
  ) THEN
    CREATE POLICY "Admins can update all entries"
    ON public.draw_entries
    FOR UPDATE
    USING (public.has_role(auth.uid(), 'admin'::public.app_role))
    WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));
  END IF;
END $$;