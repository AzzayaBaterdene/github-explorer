// src/lib/github.ts
// Everything that talks to GitHub lives here. Components call getUser / getRepos and never
// build URLs, set headers or look at status codes: they check GitHubError.kind instead.
import type { GitHubUser, Repo } from "./github-types";

const BASE_URL = "https://api.github.com";

// GitHub's recommended headers, written once and sent with every request.
const HEADERS = {
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28",
};

export const REPOS_PER_PAGE = 100; // Known gap: users with more than 100 repos only show the first 100.

// Options: (a) one kind per status category, (b) one kind per message the user sees.
// Chose (b) because ___.
export type GitHubErrorKind = "not_found" | "rate_limited" | "network" | "http";

// Options: (a) a third optional parameter, (b) one options object.
// Chose (b) because ___.
/** The one error shape components see. `status` is set when GitHub answered; `resetAt` for rate_limited. */
export class GitHubError extends Error {
  readonly kind: GitHubErrorKind;
  readonly status?: number;
  readonly resetAt?: Date;

  constructor(
    kind: GitHubErrorKind,
    details: { status?: number; resetAt?: Date } = {},
  ) {
    super(
      details.status ? `GitHub ${kind} (${details.status})` : `GitHub ${kind}`,
    );

    // this is the object being built.
    this.name = "GitHubError";
    this.kind = kind;
    this.status = details.status;
    this.resetAt = details.resetAt;
  }
}

// NEW: an aborted fetch rejects with a DOMException named "AbortError".
/** True when the request was cancelled on purpose (the login changed, or the page unmounted). */
export function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === "AbortError";
}

/** x-ratelimit-reset is epoch SECONDS; a Date needs MILLISECONDS. */
// R2: rule "check > 0, not only isFinite" → prevents a missing header (null → 0)
// showing as 1 January 1970.
function readResetTime(res: Response): Date | undefined {
  const seconds = Number(res.headers.get("x-ratelimit-reset")); // null → 0, "" → 0, "abc" → NaN
  if (!Number.isFinite(seconds) || seconds <= 0) {
    return undefined;
  }
  return new Date(seconds * 1000);
}

async function githubFetch<T>(path: string, signal?: AbortSignal): Promise<T> {
  const url = BASE_URL + path;

  // fetch only throws when there's no answer at all (offline, or cancelled). This catch is
  // allowed because it CHANGES the error: "TypeError: Failed to fetch" → GitHubError("network").
  let res: Response;
  try {
    res = await fetch(url, { headers: HEADERS, signal }); // NEW: signal
  } catch (error) {
    // NEW: cancelled on purpose is not a network problem; pass it on unchanged.
    if (isAbortError(error)) throw error;
    throw new GitHubError("network");
  }

  // GitHub answered. Most specific check first, the general !res.ok last.
  const isRateLimited =
    (res.status === 403 || res.status === 429) &&
    res.headers.get("x-ratelimit-remaining") === "0"; // header values are strings
  if (isRateLimited) {
    throw new GitHubError("rate_limited", {
      status: res.status,
      resetAt: readResetTime(res),
    });
  }

  if (res.status === 404) {
    throw new GitHubError("not_found", { status: 404 });
  }

  if (!res.ok) {
    throw new GitHubError("http", { status: res.status }); // anything else: 403 permission, 500, …
  }

  // Not checked: TypeScript trusts that this JSON is a T. Zod comes later.
  return (await res.json()) as T;
}

// Encode only the login (outside data), never the "/" we write ourselves.
export function getUser(
  login: string,
  signal?: AbortSignal,
): Promise<GitHubUser> {
  // NEW: signal
  return githubFetch<GitHubUser>(`/users/${encodeURIComponent(login)}`, signal);
}

export function getRepos(login: string, signal?: AbortSignal): Promise<Repo[]> {
  // NEW: signal
  return githubFetch<Repo[]>(
    `/users/${encodeURIComponent(login)}/repos?per_page=${REPOS_PER_PAGE}`,
    signal,
  );
}
