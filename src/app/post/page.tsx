"use client";

import { useState } from "react";
import { PasscodeGate } from "@/components/PasscodeGate";
import { PostForm } from "@/components/PostForm";

export default function PostPage() {
  const [unlocked, setUnlocked] = useState(false);

  if (!unlocked) {
    return <PasscodeGate onUnlock={() => setUnlocked(true)} />;
  }

  return <PostForm />;
}
