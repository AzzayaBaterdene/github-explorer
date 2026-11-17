import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { getRepos, getUser, GitHubError } from "./lib/github.ts";
import { MOCKS_ENABLED } from "./mocks/flag";

console.log("MOCKS_ENABLED", MOCKS_ENABLED, typeof MOCKS_ENABLED); // TEMP
console.log("raw VITE_MOCKS:", JSON.stringify(import.meta.env.VITE_MOCKS)); // TEMP
console.log("DEV:", import.meta.env.DEV, "MODE:", import.meta.env.MODE); // TEMP

// getUser("octocat")
//   .then((u) => {
//     console.log("OK", u);
//   })
//   .catch((e) => console.log("error", e));

getUser("octocat")
  .then((u) => console.log("OK", u))
  .catch((e) => console.log("error", e instanceof GitHubError ? e.kind : e)); //In a catch, e is unknown ; instanceof narrows it safely.

// getRepos("octocat")
//   .then((r) => console.log("repos OK", r))
//   .catch((err) => console.log("repos err", err));

async function enableMocking() {
  if (!MOCKS_ENABLED) return;

  const { worker } = await import("./mocks/browser");

  // Options: "bypass" (silent), "warn" (goes to the network + a warning), "error" (fails).
  // Chose "warn": if I misspell a URL in a handler, the warning tells me it wasn't mocked.
  return worker.start({ onUnhandledFrame: "warn" });
}

enableMocking().then(() => {
  const root = document.getElementById("root");
  if (!root) throw new Error('No element with id "root" in index.html');
  createRoot(root).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );

  // TEMP TEST: delete in Step 8. Runs AFTER the worker is ready, so it's mocked.
  function tryLogin(login: string) {
    const show = (what: string) => (e: unknown) =>
      console.log(
        login,
        what,
        e instanceof GitHubError ? [e.kind, e.status, e.resetAt] : e,
      );
    getUser(login)
      .then((u) => console.log(login, "user OK", u.login))
      .catch(show("user"));
    getRepos(login)
      .then((r) => console.log(login, "repos OK", r.length))
      .catch(show("repos"));
  }

  [
    "octocat",
    "gaearon",
    "mock-404",
    "mock-ratelimit",
    "mock-forbidden",
    "mock-500",
    "mock-offline",
    "nobody-here",
  ].forEach(tryLogin);
});

// createRoot(document.getElementById("root")!).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// );
