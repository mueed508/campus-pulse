import { supabase } from "./client";
import { CampusEvent, EventRow, NewEventInput, eventToRow, rowToEvent } from "./types";

export async function fetchEvents(): Promise<CampusEvent[]> {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .order("start_time", { ascending: true });

  if (error) throw error;
  return (data as EventRow[]).map(rowToEvent);
}

export async function createEvent(input: NewEventInput): Promise<CampusEvent> {
  const { data, error } = await supabase
    .from("events")
    .insert(eventToRow(input))
    .select("*")
    .single();

  if (error) throw error;
  return rowToEvent(data as EventRow);
}
