"use client";

import { useActionState } from "react";
import { loginAction, type LoginState } from "./actions";

const INITIAL: LoginState = { error: null };

export function LoginForm({ from }: { from: string }) {
  const [state, formAction, pending] = useActionState(loginAction, INITIAL);

  return (
    <form action={formAction} className="flex w-full flex-col gap-3">
      <input type="hidden" name="from" value={from} />
      <input
        type="password"
        name="password"
        placeholder="비밀번호"
        autoFocus
        required
        className="w-full rounded-2xl border border-foreground/15 bg-background px-4 py-3 text-base outline-none placeholder:text-muted/60 focus:border-foreground/40"
      />
      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-12 items-center justify-center rounded-full bg-foreground px-6 text-base font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {pending ? "확인 중…" : "입장하기"}
      </button>
      {state.error && (
        <p role="alert" className="text-center text-sm text-rose-500">
          {state.error}
        </p>
      )}
    </form>
  );
}
