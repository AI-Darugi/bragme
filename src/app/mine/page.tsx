import { MineView } from "@/components/MineView";

export const metadata = {
  title: "Mine",
  description: "Cards you spun up this session.",
};

export default function MinePage() {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-6 py-12">
      <header className="mb-8 max-w-2xl">
        <span className="font-mono text-xs uppercase tracking-[0.28em] text-muted">
          this session · anonymous
        </span>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
          Your cards.
        </h1>
        <p className="mt-2 text-sm text-muted sm:text-base">
          Cards you generated in this browser session. Close the tab and they
          fall off — save the link or download the PNG to keep them.
        </p>
      </header>

      <MineView />
    </main>
  );
}
