"use client";

import { FormEvent, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ADMIN_PASSCODE } from "@/lib/constants";
import { BrandRings } from "./BrandRings";

const SESSION_KEY = "campus-pulse-admin-unlocked";

export function PasscodeGate({ onUnlock }: { onUnlock: () => void }) {
  const [value, setValue] = useState("");
  const [shake, setShake] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(SESSION_KEY) === "true") onUnlock();
    } catch {
      // sessionStorage unavailable — fall through to manual entry
    }
  }, [onUnlock]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (value.trim() === ADMIN_PASSCODE && ADMIN_PASSCODE.length > 0) {
      try {
        sessionStorage.setItem(SESSION_KEY, "true");
      } catch {
        // ignore
      }
      onUnlock();
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 400);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6">
      <motion.form
        onSubmit={handleSubmit}
        animate={shake ? { x: [0, -8, 8, -6, 6, 0] } : {}}
        transition={{ duration: 0.4 }}
        className="relative w-full max-w-sm overflow-hidden rounded-3xl bg-paper p-8 text-center ring-1 ring-divider"
      >
        <BrandRings className="pointer-events-none absolute -left-14 -top-16 h-48 w-48 opacity-[0.07]" />
        <span className="relative mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
            <rect x="5" y="10" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.7" />
            <path d="M8 10V7a4 4 0 118 0v3" stroke="currentColor" strokeWidth="1.7" />
          </svg>
        </span>
        <h1 className="font-display mt-4 text-xl font-bold text-ink">Society &amp; sports desk</h1>
        <p className="mt-1.5 text-sm text-ink-soft">
          Enter the shared passcode to post a live event.
        </p>
        <input
          type="password"
          inputMode="text"
          autoFocus
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Passcode"
          className="mt-6 w-full rounded-xl border border-divider bg-white px-4 py-3 text-center text-lg tracking-widest text-ink outline-none ring-primary/30 focus:border-primary focus:ring-2"
        />
        <button
          type="submit"
          className="mt-4 w-full rounded-xl bg-primary px-4 py-3 font-semibold text-inverse transition hover:bg-primary-dark"
        >
          Unlock
        </button>
      </motion.form>
    </div>
  );
}
