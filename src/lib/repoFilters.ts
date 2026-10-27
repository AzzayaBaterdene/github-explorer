// ─────────────────────────────────────────────────────────────
// repoFilters.ts
// Goal (one sentence): all repos + the user's choices IN
//                      → the repos to show, in the chosen order, OUT
// Patterns: filter (keep some) → sort (order them)
// ─────────────────────────────────────────────────────────────

// Reuse existing types: one source of truth.
// `import type` = only for checking, removed at runtime.
import type { Repo } from "./github-types";
import type { Sort } from "./sorts";

// ── INPUT TYPE ───────────────────────────────────────────────
// One field per thing the user chooses in the toolbar.
// They always travel together → one object (not 4 parameters:
// no argument-order mistakes; the same type is used by state,
// toolbar, this function and the tests).
export type RepoFilters = {
  query: string;           // empty search = "" (not missing)
  language: string | null; // null = "All languages" (not a magic "all" string)
  sort: Sort;              // only the 3 sort words; typos impossible
  excludeForks: boolean;   // on or off
};

// ── SORT RULES: a table, not if/else ─────────────────────────
// "A list of cases, each with a value" → a table (like SECONDS_IN).
// Record<Sort, …> forces a rule for EVERY sort: forget one → type error.
// Outside the function: the rules never change, so create them once.
// A compare function returns: negative → a first, positive → b first, 0 → keep order.
const COMPARE: Record<Sort, (a: Repo, b: Repo) => number> = {
  // ISO dates ("2026-03-01T10:00:00Z") put the year first,
  // so text order = time order; no Date needed.
  // b before a → NEWEST first.
  updated: (a, b) => b.updated_at.localeCompare(a.updated_at),

  // Numbers: subtraction gives the sign the sort needs.
  // b - a → HIGH to LOW. Equal stars → 0 → keep order (toSorted is stable).
  stars: (a, b) => b.stargazers_count - a.stargazers_count,

  // Text: localeCompare knows alphabetical order.
  // "en" = same result on every computer.
  // sensitivity "base" = ignore case → A, b, c (not A, c, b). a before b → A to Z.
  name: (a, b) => a.name.localeCompare(b.name, "en", { sensitivity: "base" }),
};

// ── MAIN FUNCTION ────────────────────────────────────────────
// Pure: no React, no state, no network. Same input → same output → easy to test.
// Always returns an array (maybe []), never null, so callers don't need checks.
export function filterAndSortRepos(repos: Repo[], filters: RepoFilters): Repo[] {
  // Clean the search text ONCE (it's the same for every repo).
  // "  HELLO " → "hello"   (trim: accidental spaces; lowercase: case-insensitive)
  // "   "      → ""        (only spaces counts as empty)
  const query = filters.query.trim().toLowerCase();

  // filter asks the function below about EACH repo:
  // true → keep it, false → drop it. It builds a NEW array.
  // repos = [] → the function never runs → [] (no special code needed).
  const matching = repos.filter((repo) => {
    // GATE 1 · excludeForks (cheapest check first: two booleans)
    // "If hiding forks AND it's a fork → out."
    // Checkbox off → skipped. Uses `fork` (is it a fork?), NOT forks_count.
    if (filters.excludeForks && repo.fork) return false;

    // GATE 2 · language
    // "If a language IS chosen AND this repo's is different → out."
    // null (All) → skipped, every repo passes.
    // Repo with language null while "Ruby" is chosen → out (correct: not Ruby).
    // `!== null` says exactly what "no choice" means (clearer than a truthy check).
    if (filters.language !== null && repo.language !== filters.language) return false;

    // GATE 3 · empty search
    // Nothing typed → keep (it already passed gates 1 and 2).
    // States the intent and skips the string work below.
    if (query === "") return true;

    // Prepare this repo's text (dangerous values handled):
    // any case → lowercase, to match the lowercase query.
    // description null → ?? "" → "" so .toLowerCase() can't crash
    // (handling, not narrowing: "" is a sensible replacement).
    // NOT repo.description!.toLowerCase(): the ! hides null and crashes.
    const name = repo.name.toLowerCase();
    const description = (repo.description ?? "").toLowerCase();

    // GATE 4 · text match
    // Keep if the name OR the description contains the search (the spec says both).
    // Between gates = AND; inside this gate = OR.
    // includes finds the text anywhere: "world" matches "hello-world".
    return name.includes(query) || description.includes(query);
  });

  // Pick the user's rule from the table, and return a NEW sorted array.
  // matching = [] → [] (sorting nothing is fine).
  // toSorted (not sort): never changes the array it's given.
  return matching.toSorted(COMPARE[filters.sort]);
}

// ── LANGUAGE OPTIONS for the <select> ────────────────────────
// Each language that appears, ONCE, alphabetically, WITHOUT null.
// Calculated from ALL repos (not the filtered ones), so choosing
// "Ruby" doesn't remove the other languages from the dropdown.
export function languageOptions(repos: Repo[]): string[] {
  // "Unique values" → a Set: adding "Ruby" twice keeps it once.
  const languages = new Set<string>();

  for (const repo of repos) {
    // Narrowing: language is string | null, the Set only takes strings.
    // After the check it's string. Also keeps "no language" out of the dropdown.
    if (repo.language !== null) languages.add(repo.language);
  }

  // [...set] turns the Set into an array (Sets can't be sorted or mapped).
  // localeCompare = proper alphabetical order; toSorted = a new array.
  return [...languages].toSorted((a, b) => a.localeCompare(b));
}