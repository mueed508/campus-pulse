"use client";

import { useEffect, useState } from "react";
import { deleteEvent, fetchMyEvents, updateEvent } from "@/lib/events/api";
import { CampusEvent } from "@/lib/events/types";
import { toDatetimeLocalValue } from "@/lib/time";

export function MyEvents() {
  const [events, setEvents] = useState<CampusEvent[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const data = await fetchMyEvents();
        if (cancelled) return;
        setEvents(data);
        setError(null);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load your events");
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Delete this event? This can't be undone.")) return;
    try {
      await deleteEvent(id);
      setEvents((prev) => prev?.filter((e) => e.id !== id) ?? null);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete event");
    }
  }

  if (error) {
    return <p className="text-sm font-medium text-error">{error}</p>;
  }

  if (!events) {
    return <p className="text-sm text-ink-soft">Loading your events…</p>;
  }

  if (events.length === 0) {
    return <p className="text-sm text-ink-soft">You haven&apos;t posted any events yet.</p>;
  }

  return (
    <div className="flex w-full flex-col gap-3">
      {events.map((event) =>
        editingId === event.id ? (
          <EditEventForm
            key={event.id}
            event={event}
            onCancel={() => setEditingId(null)}
            onSaved={(updated) => {
              setEvents((prev) => prev?.map((e) => (e.id === updated.id ? updated : e)) ?? null);
              setEditingId(null);
            }}
          />
        ) : (
          <div key={event.id} className="rounded-xl border border-divider bg-white p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate font-semibold text-ink">{event.title}</p>
                <p className="mt-0.5 text-xs text-ink-soft">
                  {event.location} · {new Date(event.startTime).toLocaleString()}
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  onClick={() => setEditingId(event.id)}
                  className="rounded-full border border-divider px-3 py-1.5 text-xs font-semibold text-ink hover:bg-paper"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(event.id)}
                  className="rounded-full border border-error/30 px-3 py-1.5 text-xs font-semibold text-error hover:bg-error/10"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
}

function EditEventForm({
  event,
  onCancel,
  onSaved,
}: {
  event: CampusEvent;
  onCancel: () => void;
  onSaved: (event: CampusEvent) => void;
}) {
  const [title, setTitle] = useState(event.title);
  const [location, setLocation] = useState(event.location);
  const [description, setDescription] = useState(event.description ?? "");
  const [startTimeInput, setStartTimeInput] = useState(toDatetimeLocalValue(new Date(event.startTime)));
  const [endTimeInput, setEndTimeInput] = useState(
    event.expiresAt ? toDatetimeLocalValue(new Date(event.expiresAt)) : ""
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      const updated = await updateEvent(event.id, {
        title: title.trim(),
        location: location.trim(),
        description: description.trim() || null,
        startTime: new Date(startTimeInput).toISOString(),
        expiresAt: endTimeInput ? new Date(endTimeInput).toISOString() : null,
      });
      onSaved(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save changes");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-2.5 rounded-xl border border-primary/30 bg-white p-4">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        className="w-full rounded-lg border border-divider px-3 py-2 text-sm text-ink outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
      />
      <input
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder="Location"
        className="w-full rounded-lg border border-divider px-3 py-2 text-sm text-ink outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
      />
      <div className="flex gap-2">
        <input
          type="datetime-local"
          value={startTimeInput}
          onChange={(e) => setStartTimeInput(e.target.value)}
          className="w-full rounded-lg border border-divider px-3 py-2 text-sm text-ink outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
        />
        <input
          type="datetime-local"
          value={endTimeInput}
          onChange={(e) => setEndTimeInput(e.target.value)}
          className="w-full rounded-lg border border-divider px-3 py-2 text-sm text-ink outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
        />
      </div>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description (optional)"
        rows={2}
        className="w-full resize-none rounded-lg border border-divider px-3 py-2 text-sm text-ink outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
      />
      {error && <p className="text-xs font-medium text-error">{error}</p>}
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full border border-divider px-3 py-1.5 text-xs font-semibold text-ink hover:bg-paper"
        >
          Cancel
        </button>
        <button
          type="button"
          disabled={saving}
          onClick={handleSave}
          className="rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-inverse hover:bg-primary-dark disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save"}
        </button>
      </div>
    </div>
  );
}
