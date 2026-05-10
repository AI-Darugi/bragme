import { LoginForm } from "./LoginForm";

export const metadata = {
  title: "비밀번호 입력",
  robots: { index: false, follow: false },
};

type SearchParams = { from?: string };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { from } = await searchParams;
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center gap-6 px-6 py-20 text-center">
      <span className="font-mono text-xs uppercase tracking-[0.28em] text-muted">
        비공개 미리보기
      </span>
      <h1 className="text-balance text-3xl font-semibold leading-[1.1] tracking-tight sm:text-4xl">
        비밀번호를 입력해주세요.
      </h1>
      <p className="text-sm text-muted">
        이 페이지는 한국어 미리보기 전용입니다. 권한이 있는 사람만
        들어올 수 있어요.
      </p>
      <LoginForm from={from ?? "/glorious"} />
    </main>
  );
}
