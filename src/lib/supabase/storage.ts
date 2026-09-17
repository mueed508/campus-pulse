import { supabase } from "./client";

const BUCKET = "event-images";
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
  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });

  if (error) throw error;

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
