-- Drop the duplicate trigger that's causing double counting
DROP TRIGGER IF EXISTS trg_update_draw_entry_count ON public.draw_entries;

-- Sync current_entries with actual entry counts (fix corrupted data)
UPDATE draws d
SET current_entries = COALESCE(
  (SELECT SUM(entries_count) FROM draw_entries WHERE draw_id = d.id),
  0
);