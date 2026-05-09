export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-20">
      <div className="flex flex-col items-center gap-6 text-center max-w-2xl">
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
          v0 · scaffold
        </span>
        <h1 className="text-5xl sm:text-6xl font-semibold tracking-tight">
          BragMe
        </h1>
        <p className="text-lg sm:text-xl text-muted">
          Spill your mess. We&apos;ll find your magic.
        </p>
        <p className="text-sm text-muted/80 max-w-md">
          Step 1 complete: Next.js 16.2 + React 19 + Tailwind v4 + React
          Compiler. Form, AI, and cards land in steps 3–5.
        </p>
      </div>
    </main>
  );
}
