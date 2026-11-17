// src/mocks/handlers.ts
// Fake GitHub for development. Data (who exists, which errors) is kept separate from logic
// (one function that picks the response), so adding a user or an error case is one line.

import { delay, http, HttpResponse } from "msw";
import { FIXTURES } from "../fixtures"; // one source of fixtures

const API = "https://api.github.com";

// ← Replace with the exact 404 body you copied from the real GitHub in 7d-0.
const NOT_FOUND_BODY = { message: "Not Found", documentation_url: "https://docs.github.com/rest" };

// x-ratelimit-reset is epoch SECONDS, and header values are strings.
function resetInTenMinutes(): string {
  return String(Math.floor(Date.now() / 1000) + 10 * 60);
}

// Functions, not responses: a new response per request, and the time is calculated per request.
const ERROR_SCENARIOS: Record<string, () => Response> = {
  "mock-404": () => HttpResponse.json(NOT_FOUND_BODY, { status: 404 }),

  "mock-ratelimit": () =>
    HttpResponse.json(
      { message: "API rate limit exceeded" },
      {
        status: 403,
        headers: { "x-ratelimit-remaining": "0", "x-ratelimit-reset": resetInTenMinutes() },
      },
    ),

  "mock-forbidden": () =>
    HttpResponse.json(
      { message: "Forbidden" },
      { status: 403, headers: { "x-ratelimit-remaining": "12" } },
    ),

  "mock-500": () => HttpResponse.json({ message: "Server Error" }, { status: 500 }),

  "mock-offline": () => HttpResponse.error(), // fetch rejects, like having no wifi
};

// Step 9: the profile works but the repos fail, to show the two requests are independent.
const REPOS_FAIL: Record<string, { profileOf: string; reposError: () => Response }> = {
  "mock-repos-500": {
    profileOf: "octocat",
    reposError: () => HttpResponse.json({ message: "Server Error" }, { status: 500 }),
  },
};

// NEW (Step 10): a slow user, to cause the race on purpose (lesson 20: reproduce, then fix).
const SLOW: Record<string, { profileOf: string; ms: number }> = {
  "mock-slow": { profileOf: "octocat", ms: 2000 },
};

// One rule for both endpoints.
function mockResponse(login: string, part: "user" | "repos"): Response {
  const key = login.toLowerCase();

  const scenario = ERROR_SCENARIOS[key];
  if (scenario) return scenario(); // error cases first

  const partial = REPOS_FAIL[key];
  if (partial) {
    if (part === "repos") return partial.reposError();
    const borrowed = FIXTURES[partial.profileOf];
    if (borrowed) return HttpResponse.json(borrowed.user);
  }

  const fixture = FIXTURES[key];
  if (!fixture) return HttpResponse.json(NOT_FOUND_BODY, { status: 404 }); // unknown → 404

  return HttpResponse.json(fixture[part]);
}

// NEW: waits first if the login is a slow one, then answers like mockResponse.
async function respond(login: string, part: "user" | "repos"): Promise<Response> {
  const slow = SLOW[login.toLowerCase()];
  if (slow) {
    await delay(slow.ms);
    return mockResponse(slow.profileOf, part);
  }
  return mockResponse(login, part);
}

// :login matches ONE path segment, so it never swallows "/repos".
// Don't put ?per_page in the URL: MSW matches the path and ignores the query string.
export const handlers = [
  http.get<{ login: string }>(`${API}/users/:login`, ({ params }) =>
    respond(params.login, "user"),
  ),
  http.get<{ login: string }>(`${API}/users/:login/repos`, ({ params }) =>
    respond(params.login, "repos"),
  ),
];