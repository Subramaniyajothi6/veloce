"use server";

import { redirect } from "next/navigation";
import { authConfigured, startSession } from "@/lib/auth";

export interface LoginState {
  error?: string;
}

/** Verify the admin password and start a session. */
export async function login(
  _prev: LoginState,
  formData: FormData
): Promise<LoginState> {
  if (!authConfigured()) {
    return {
      error:
        "Admin auth isn't configured. Set ADMIN_PASSWORD and SESSION_SECRET in the environment.",
    };
  }

  const password = String(formData.get("password") ?? "");
  if (!password) return { error: "Enter the password." };
  if (password !== process.env.ADMIN_PASSWORD) {
    return { error: "Incorrect password." };
  }

  await startSession();
  redirect("/admin");
}
