import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAuthed } from "@/lib/auth";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Admin — VELOCE Motors",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  if (await isAuthed()) redirect("/admin");

  return (
    <main className="min-h-svh grid place-items-center bg-night px-6">
      <div className="w-full max-w-[22rem]">
        <span className="eyebrow">
          <b>VELOCE</b> Admin
        </span>
        <h1 className="font-display uppercase text-[clamp(2.2rem,8vw,3rem)] leading-[0.95] mt-3 mb-8">
          Sign in
        </h1>
        <LoginForm />
        <p className="font-mono text-[0.62rem] tracking-[0.22em] uppercase text-ash/70 mt-8">
          Authorised personnel only
        </p>
      </div>
    </main>
  );
}
