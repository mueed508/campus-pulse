"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { UserButton } from "@clerk/nextjs";
import { createEvent } from "@/lib/events/api";
import { DURATION_PRESETS } from "@/lib/constants";
import { EventType } from "@/lib/events/types";
import { toDatetimeLocalValue } from "@/lib/time";
import { SportKind } from "@/lib/sportKinds";
import { SocietyIcon, SportsIcon } from "./icons";
import { SportKindPicker } from "./SportKindPicker";
import { ImageUploadField } from "./ImageUploadField";
import { BrandRings } from "./BrandRings";

type StartMode = "now" | "later";
type DurationMode = "preset" | "custom";

export function PostForm() {
  const [title, setTitle] = useState("");
  const [type, setType] = useState<EventType>("sports");
  const [sportKind, setSportKind] = useState<SportKind>("football");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [location, setLocation] = useState("");
  const [postedBy, setPostedBy] = useState("");
  const [description, setDescription] = useState("");
  const [startMode, setStartMode] = useState<StartMode>("now");
  const [startTimeInput, setStartTimeInput] = useState(() =>
    toDatetimeLocalValue(new Date(Date.now() + 30 * 60000))
  );
  const [durationMode, setDurationMode] = useState<DurationMode>("preset");
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [endTimeInput, setEndTimeInput] = useState(() =>
    toDatetimeLocalValue(new Date(Date.now() + 4 * 60 * 60000))
  );
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const canSubmit = title.trim().length > 0 && location.trim().length > 0 && postedBy.trim().length > 0;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!canSubmit || submitting) return;

    setSubmitting(true);
    setSubmitError(null);

    const startTime = startMode === "now" ? new Date() : new Date(startTimeInput);
    const expiresAt =
      durationMode === "custom"
        ? new Date(endTimeInput)
        : new Date(startTime.getTime() + durationMinutes * 60000);

    try {
      await createEvent({
        title: title.trim(),
        type,
        location: location.trim(),
        postedBy: postedBy.trim(),
        startTime: startTime.toISOString(),
        expiresAt: expiresAt.toISOString(),
        description: description.trim() || null,
        sportKind: type === "sports" ? sportKind : null,
        imageUrl,
      });
      setSuccess(true);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Something went wrong. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function resetForm() {
    setTitle("");
    setLocation("");
    setPostedBy("");
    setDescription("");
    setStartMode("now");
    setDurationMode("preset");
    setDurationMinutes(60);
    setSportKind("football");
    setImageUrl(null);
    setSuccess(false);
  }

  if (success) {
    return (
      <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center">
        <BrandRings className="pointer-events-none absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 opacity-[0.05]" />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 22 }}
          className="flex h-16 w-16 items-center justify-center rounded-full bg-success/10 text-success"
        >
          <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8">
            <path
              d="M5 13l4.5 4.5L19 7"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>
        <h1 className="font-display relative mt-5 text-3xl font-bold tracking-tight text-ink">
          Live now
        </h1>
        <p className="mt-2 max-w-xs text-sm text-ink-soft">
          {title || "Your event"} just went out to the campus feed in real time.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            onClick={resetForm}
            className="rounded-full border border-divider px-5 py-2.5 text-sm font-semibold text-ink transition hover:bg-paper"
          >
            Post another
          </button>
          <Link
            href="/dashboard"
            className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-inverse transition hover:bg-primary-dark"
          >
            View live feed
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-screen w-full max-w-lg px-5 py-8 sm:px-8">
      <div className="flex items-center justify-between">
        <Link href="/dashboard" className="text-sm font-medium text-secondary hover:text-secondary-dark">
          ← Back to feed
        </Link>
        <UserButton />
      </div>
      <h1 className="font-display mt-3 text-3xl font-bold tracking-tight text-ink">
        Post a live event
      </h1>
      <p className="mt-1 text-sm text-ink-soft">Under two minutes. It&apos;ll show up instantly.</p>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-5">
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-ink">What&apos;s happening?</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="5-a-side football, need 2 players"
            className="w-full rounded-xl border border-divider bg-white px-4 py-3 text-ink outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-ink">Type</label>
          <div className="flex gap-2">
            {(
              [
                { key: "sports" as const, label: "Sports", Icon: SportsIcon },
                { key: "society" as const, label: "Society", Icon: SocietyIcon },
              ]
            ).map(({ key, label, Icon }) => (
              <button
                key={key}
                type="button"
                onClick={() => setType(key)}
                className={`flex flex-1 items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                  type === key
                    ? "border-primary bg-primary text-inverse"
                    : "border-divider bg-white text-ink-soft"
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {type === "sports" && <SportKindPicker value={sportKind} onChange={setSportKind} />}

        <ImageUploadField imageUrl={imageUrl} onChange={setImageUrl} />

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-ink">Location</label>
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Sports Complex, Ground 2"
            className="w-full rounded-xl border border-divider bg-white px-4 py-3 text-ink outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-ink">Starts</label>
          <div className="flex gap-2">
            {(["now", "later"] as StartMode[]).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setStartMode(mode)}
                className={`flex-1 rounded-xl border px-4 py-3 text-sm font-semibold capitalize transition ${
                  startMode === mode
                    ? "border-primary bg-primary text-inverse"
                    : "border-divider bg-white text-ink-soft"
                }`}
              >
                {mode === "now" ? "Right now" : "Schedule"}
              </button>
            ))}
          </div>
          {startMode === "later" && (
            <input
              type="datetime-local"
              value={startTimeInput}
              onChange={(e) => setStartTimeInput(e.target.value)}
              className="mt-2.5 w-full rounded-xl border border-divider bg-white px-4 py-3 text-ink outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
            />
          )}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-ink">Duration</label>
          <div className="grid grid-cols-4 gap-2">
            {DURATION_PRESETS.map((preset) => (
              <button
                key={preset.minutes}
                type="button"
                onClick={() => {
                  setDurationMode("preset");
                  setDurationMinutes(preset.minutes);
                }}
                className={`rounded-xl border px-2 py-3 text-sm font-semibold transition ${
                  durationMode === "preset" && durationMinutes === preset.minutes
                    ? "border-secondary bg-secondary text-inverse"
                    : "border-divider bg-white text-ink-soft"
                }`}
              >
                {preset.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setDurationMode("custom")}
              className={`rounded-xl border px-2 py-3 text-sm font-semibold transition ${
                durationMode === "custom"
                  ? "border-secondary bg-secondary text-inverse"
                  : "border-divider bg-white text-ink-soft"
              }`}
            >
              Custom
            </button>
          </div>
          {durationMode === "custom" && (
            <div className="mt-2.5">
              <label className="mb-1.5 block text-xs font-medium text-ink-soft">Ends at</label>
              <input
                type="datetime-local"
                value={endTimeInput}
                onChange={(e) => setEndTimeInput(e.target.value)}
                className="w-full rounded-xl border border-divider bg-white px-4 py-3 text-ink outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
              />
              <p className="mt-1.5 text-xs text-ink-soft">
                For multi-day events — expos, tournaments, week-long drives.
              </p>
            </div>
          )}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-ink">Posted by</label>
          <input
            value={postedBy}
            onChange={(e) => setPostedBy(e.target.value)}
            placeholder="ACM COMSATS / Sports Dept"
            className="w-full rounded-xl border border-divider bg-white px-4 py-3 text-ink outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-ink">
            Description <span className="font-normal text-ink-soft">(optional)</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Anything students should know before showing up"
            rows={2}
            className="w-full resize-none rounded-xl border border-divider bg-white px-4 py-3 text-ink outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
          />
        </div>

        {submitError && (
          <p className="rounded-xl bg-error/10 px-4 py-3 text-sm font-medium text-error">
            {submitError}
          </p>
        )}

        <button
          type="submit"
          disabled={!canSubmit || submitting}
          className="mt-1 w-full rounded-xl bg-primary px-4 py-3.5 font-semibold text-inverse transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-40"
        >
          {submitting ? "Posting…" : "Post event"}
        </button>
      </form>
    </div>
  );
}
