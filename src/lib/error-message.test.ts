import { describe, expect, it } from "vitest";
import { GitHubError } from "./github";
import { errorMessage } from "./error-message";

// A fixed formatter, so the test gives the same result on every computer.
const fakeTime = (d: Date) =>
  `${d.getUTCHours()}:${String(d.getUTCMinutes()).padStart(2, "0")}`;
const RESET = new Date(Date.UTC(2026, 10, 7, 14, 32)); // 14:32 UTC

describe("errorMessage", () => {
  it.each([
    [
      "not found",
      new GitHubError("not_found", { status: 404 }),
      'No user called "ghost".',
    ],
    [
      "rate limit with reset",
      new GitHubError("rate_limited", { status: 403, resetAt: RESET }),
      "Rate limit reached, resets at 14:32.",
    ],
    [
      "rate limit, no reset",
      new GitHubError("rate_limited", { status: 403 }),
      "Rate limit reached. Try again later.",
    ],
    [
      "network",
      new GitHubError("network"),
      "Can't reach GitHub. Check your connection.",
    ],
    [
      "server error",
      new GitHubError("http", { status: 500 }),
      "GitHub returned an error (500). Please try again.",
    ],
    [
      "forbidden",
      new GitHubError("http", { status: 403 }),
      "GitHub returned an error (403). Please try again.",
    ],
    [
      "a bug in our code",
      new TypeError("x"),
      "Something went wrong. Please try again.",
    ],
    [
      "a thrown string",
      "just a string",
      "Something went wrong. Please try again.",
    ],
  ])("%s", (_name, error, expected) => {
    expect(errorMessage(error, "ghost", fakeTime)).toBe(expected);
  });
});
