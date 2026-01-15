-- Function to update draw entry count when entries change
CREATE OR REPLACE FUNCTION update_draw_entry_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE draws SET current_entries = current_entries + NEW.entries_count 
    WHERE id = NEW.draw_id;
  ELSIF TG_OP = 'UPDATE' THEN
    UPDATE draws SET current_entries = current_entries + (NEW.entries_count - OLD.entries_count) 
    WHERE id = NEW.draw_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE draws SET current_entries = current_entries - OLD.entries_count 
    WHERE id = OLD.draw_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger on draw_entries
CREATE TRIGGER on_draw_entry_change
  AFTER INSERT OR UPDATE OR DELETE ON draw_entries
  FOR EACH ROW EXECUTE FUNCTION update_draw_entry_count();

-- Enable realtime for draws and draw_entries tables
ALTER PUBLICATION supabase_realtime ADD TABLE draws;
ALTER PUBLICATION supabase_realtime ADD TABLE draw_entries;