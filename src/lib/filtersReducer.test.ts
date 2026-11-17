// src/lib/filtersReducer.test.ts
import { describe, expect, it } from "vitest";
import {
  DEFAULT_FILTERS,
  filtersReducer,
  type FiltersAction,
} from "./filtersReducer";
import type { RepoFilters } from "./repoFilters";

// Every field differs from DEFAULT_FILTERS, so a wrong field or a missed reset shows up.
const busy: RepoFilters = {
  query: "api",
  language: "TypeScript",
  sort: "stars",
  excludeForks: true,
  favouritesOnly: true
};

describe("filtersReducer", () => {
  it.each<{
    name: string;
    state: RepoFilters;
    action: FiltersAction;
    expected: RepoFilters;
  }>([
    {
      name: "queryChanged sets only the query",
      state: DEFAULT_FILTERS,
      action: { type: "queryChanged", query: "re" },
      expected: { ...DEFAULT_FILTERS, query: "re" },
    },
    {
      name: "queryChanged can empty the search",
      state: busy,
      action: { type: "queryChanged", query: "" },
      expected: { ...busy, query: "" },
    },
    // The reducer stores what was typed; trimming/lowercasing happens in filterAndSortRepos.
    {
      name: "queryChanged keeps the raw text",
      state: DEFAULT_FILTERS,
      action: { type: "queryChanged", query: "  API " },
      expected: { ...DEFAULT_FILTERS, query: "  API " },
    },
    {
      name: "languagePicked sets a language",
      state: DEFAULT_FILTERS,
      action: { type: "languagePicked", language: "Ruby" },
      expected: { ...DEFAULT_FILTERS, language: "Ruby" },
    },
    {
      name: "languagePicked null means All languages",
      state: busy,
      action: { type: "languagePicked", language: null },
      expected: { ...busy, language: null },
    },
    {
      name: "sortChanged sets the sort",
      state: DEFAULT_FILTERS,
      action: { type: "sortChanged", sort: "stars" },
      expected: { ...DEFAULT_FILTERS, sort: "stars" },
    },
    {
      name: "excludeForksChanged true hides forks",
      state: DEFAULT_FILTERS,
      action: { type: "excludeForksChanged", excludeForks: true },
      expected: { ...DEFAULT_FILTERS, excludeForks: true },
    },
    // Set, not toggle: false stays false (a toggle would flip it to true).
    {
      name: "excludeForksChanged false stays false",
      state: DEFAULT_FILTERS,
      action: { type: "excludeForksChanged", excludeForks: false },
      expected: { ...DEFAULT_FILTERS, excludeForks: false },
    },
    {
      name: "cleared resets every field",
      state: busy,
      action: { type: "cleared" },
      expected: DEFAULT_FILTERS,
    },
    {
      name: "cleared from the defaults stays the defaults",
      state: DEFAULT_FILTERS,
      action: { type: "cleared" },
      expected: DEFAULT_FILTERS,
    },
  ])("$name", ({ state, action, expected }) => {
    expect(filtersReducer(state, action)).toEqual(expected);
  });

  it("returns a new object and never changes the old state", () => {
    const before = { ...busy };
    const next = filtersReducer(busy, { type: "sortChanged", sort: "name" });
    expect(next).not.toBe(busy); // a new object, so React re-renders
    expect(busy).toEqual(before); // the old state is untouched (pure)
  });

  it("throws on an unknown action", () => {
    // `as never` forces a bad action past TypeScript: the case the throw exists for.
    expect(() =>
      filtersReducer(DEFAULT_FILTERS, { type: "nope" } as never),
    ).toThrow(/Unknown action/);
  });
});
