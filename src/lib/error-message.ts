// src/lib/error-message.ts
// Turns any error into the sentence the user sees. Pure: no React, no fetch, easy to test.

import { GitHubError } from "./github";

export type FormatTime = (date: Date) => string;

// Default: the user's own clock format, e.g. "14:32" or "2:32 PM".
const defaultFormatTime: FormatTime = (date) =>
  date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

export function errorMessage(
  error: unknown,
  login: string,
  formatTime: FormatTime = defaultFormatTime,
): string {
  // Not our error (a bug, or something odd was thrown): one general message.
  if (!(error instanceof GitHubError)) {
    return "Something went wrong. Please try again.";
  }

  switch (error.kind) {
    case "not_found":
      return `No user called "${login}".`;

    case "rate_limited":
      // Don't invent a time we don't know.
      return error.resetAt
        ? `Rate limit reached, resets at ${formatTime(error.resetAt)}.`
        : "Rate limit reached. Try again later.";

    case "network":
      return "Can't reach GitHub. Check your connection.";

    case "http":
      return `GitHub returned an error${error.status ? ` (${error.status})` : ""}. Please try again.`;

    default: {
      // If a new kind is added and not handled above, this line turns red.
      const unhandled: never = error.kind;
      return unhandled;
    }
  }
}
