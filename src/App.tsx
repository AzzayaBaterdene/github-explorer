import { useState } from "react";
import { SearchForm } from "./components/SearchForm";
import { UserPage } from "./components/UserPage";

const USING_MOCKS = import.meta.env.VITE_MOCKS === "true";

// One container style for the header, main and footer: centred, capped width, side padding.
// No fixed widths, so the layout can shrink on small screens (Step 6).
const container = "mx-auto w-full max-w-5xl px-4 sm:px-6";

export default function App() {
  const [login, setLogin] = useState("octocat");

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-border bg-surface">
        <div
          className={`${container} flex flex-wrap items-center gap-x-6 gap-y-3 py-4`}
        >
          <h1 className="text-2xl font-semibold tracking-tight">
            GitHub Explorer by Azzaya
          </h1>
          <SearchForm onSearch={setLogin} />
          {USING_MOCKS && (
            <span className="rounded-full border border-warning bg-warning-soft px-2.5 py-0.5 text-xs font-medium text-warning">
              Mock data
            </span>
          )}
        </div>
      </header>

      <main className={`${container} flex flex-1 flex-col gap-6 py-6`}>
        {/* Decision: key={login} gives each user a fresh UserPage, so favourites and
            filters reset on a new search instead of leaking from the last user. */}
        <UserPage key={login} login={login} />
      </main>

      <footer className="border-t border-border">
        <div className={`${container} py-4 text-sm text-muted`}>
          Data from the{" "}
          <a
            href="https://docs.github.com/en/rest"
            className="underline underline-offset-2 hover:text-text"
          >
            GitHub REST API
          </a>
          .
        </div>
      </footer>
    </div>
  );
}
