"use client";

import { ChangeEvent, useRef, useState } from "react";
import { uploadEventImage, validateEventImage } from "@/lib/events/api";
import { CameraIcon, XIcon } from "./icons";

interface ImageUploadFieldProps {
  imageUrl: string | null;
  onChange: (url: string | null) => void;
}

export function ImageUploadField({ imageUrl, onChange }: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    const validationError = validateEventImage(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setUploading(true);
    try {
      const url = await uploadEventImage(file);
      onChange(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed. Try again.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-ink">
        Event graphic <span className="font-normal text-ink-soft">(optional)</span>
      </label>

      {imageUrl ? (
        <div className="relative h-40 w-full overflow-hidden rounded-xl bg-ink ring-1 ring-divider">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full scale-110 object-cover opacity-60 blur-2xl"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imageUrl} alt="" className="relative h-full w-full object-contain" />
          <button
            type="button"
            onClick={() => onChange(null)}
            className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/50 text-white"
            aria-label="Remove image"
          >
            <XIcon className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-divider bg-white px-4 py-4 text-sm font-medium text-ink-soft transition hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
        >
          <CameraIcon className="h-4 w-4" />
          {uploading ? "Uploading…" : "Add a photo"}
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={handleFile}
      />

      {error && <p className="mt-1.5 text-xs font-medium text-error">{error}</p>}
    </div>
  );
}
