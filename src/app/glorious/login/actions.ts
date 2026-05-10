"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE_NAME = "bragme_glorious";
const THIRTY_DAYS = 60 * 60 * 24 * 30;

export type LoginState = { error: string | null };

export async function loginAction(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const password = formData.get("password");
  const from = formData.get("from");
  const expected = process.env.GLORIOUS_PASSWORD;

  if (!expected) {
    return { error: "GLORIOUS_PASSWORD가 서버에 설정되지 않았어요." };
  }
  if (typeof password !== "string" || !password) {
    return { error: "비밀번호를 입력해주세요." };
  }
  if (password !== expected) {
    return { error: "비밀번호가 틀렸어요." };
  }

  const store = await cookies();
  store.set(COOKIE_NAME, "ok", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: THIRTY_DAYS,
    path: "/",
  });

  const target =
    typeof from === "string" && from.startsWith("/glorious")
      ? from
      : "/glorious";
  redirect(target);
}
