import { CampusEvent, NewEventInput } from "./types";

export async function fetchEvents(): Promise<CampusEvent[]> {
  const res = await fetch("/api/events", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load events");
  return res.json();
}

export async function createEvent(input: NewEventInput): Promise<CampusEvent> {
  const res = await fetch("/api/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error ?? "Failed to post event");
  }
  return res.json();
}

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export function validateEventImage(file: File): string | null {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return "Use a JPG, PNG, WEBP, or GIF image.";
  }
  if (file.size > MAX_BYTES) {
    return "Image must be under 5MB.";
  }
  return null;
}

export async function uploadEventImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("/api/upload", { method: "POST", body: formData });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error ?? "Upload failed");
  }
  const data = await res.json();
  return data.url;
}
