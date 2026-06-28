"use client";

import { useActionState } from "react";
import { login, type LoginState } from "./actions";

const initial: LoginState = {};

export default function LoginForm() {
  const [state, action, pending] = useActionState(login, initial);

  return (
    <form action={action} className="grid gap-4">
      <label className="grid gap-2">
        <span className="font-mono text-[0.66rem] tracking-[0.26em] uppercase text-ash">
          Password
        </span>
        <input
          type="password"
          name="password"
          autoFocus
          autoComplete="current-password"
          className="bg-panel border border-line px-4 py-3 text-cream outline-none focus:border-veloce transition-colors"
        />
      </label>

      {state.error && (
        <p className="font-mono text-[0.72rem] text-veloce leading-relaxed">
          {state.error}
        </p>
      )}

      <button type="submit" disabled={pending} className="btn btn-red mt-2 disabled:opacity-60">
        <span>{pending ? "Checking…" : "Enter"}</span> <b className="arr">→</b>
      </button>
    </form>
  );
}
