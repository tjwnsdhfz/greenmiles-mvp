"use server";

import { redirect } from "next/navigation";

import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

function authRedirect(message: string) {
  redirect(`/auth?message=${encodeURIComponent(message)}`);
}

function readCredentials(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    authRedirect("Email and password are required.");
  }

  return { email, password };
}

export async function signIn(formData: FormData) {
  if (!hasSupabaseEnv()) {
    authRedirect("Supabase environment values are required before sign-in.");
  }

  const { email, password } = readCredentials(formData);
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    authRedirect(error.message);
  }

  redirect("/dashboard");
}

export async function signUp(formData: FormData) {
  if (!hasSupabaseEnv()) {
    authRedirect("Supabase environment values are required before sign-up.");
  }

  const { email, password } = readCredentials(formData);
  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        display_name: email.split("@")[0],
      },
    },
  });

  if (error) {
    authRedirect(error.message);
  }

  redirect("/dashboard");
}

export async function signOut() {
  if (hasSupabaseEnv()) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }

  redirect("/dashboard");
}
