import { Show, SignIn } from "@clerk/nextjs";
import { BrandRings } from "@/components/BrandRings";
import { PostForm } from "@/components/PostForm";

export default function PostPage() {
  return (
    <>
      <Show when="signed-out">
        <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-6 py-12">
          <BrandRings className="pointer-events-none absolute -left-14 -top-16 h-48 w-48 opacity-[0.07]" />
          <SignIn routing="hash" />
        </div>
      </Show>
      <Show when="signed-in">
        <PostForm />
      </Show>
    </>
  );
}
