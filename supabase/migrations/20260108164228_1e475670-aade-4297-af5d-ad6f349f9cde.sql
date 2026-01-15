-- Sync current_entries with actual data from draw_entries
UPDATE draws d
SET current_entries = COALESCE(
  (SELECT SUM(entries_count) FROM draw_entries WHERE draw_id = d.id),
  0
);

-- Enable full replica identity for reliable realtime updates
ALTER TABLE draws REPLICA IDENTITY FULL;
ALTER TABLE draw_entries REPLICA IDENTITY FULL;