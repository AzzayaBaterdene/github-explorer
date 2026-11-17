// FilterAction, RequestAction
// name the actions after what the user did, not after the field they change
// 1. typed in the search box
// 2. picked a language
// 3. changed the sort
// 4. used the forks checkbox
// 5. clicked "Clear" button

import type { RepoFilters } from "./repoFilters";

// Every action the user can take in the repo toolbar.
// Payload types are looked up from RepoFilters (e.g. RepoFilters["sort"]) instead of typed by hand,
// so RepoFilters stays the one source of truth: if a field's type changes there, these actions follow.
export type FiltersAction =
  | { type: "queryChanged"; query: RepoFilters["query"] }
  | { type: "languagePicked"; language: RepoFilters["language"] } // null = "All languages"
  | { type: "sortChanged"; sort: RepoFilters["sort"] }
  // "Set (new value)", not "toggle": the action carries the checkbox's real `checked` value,
  // so the state always matches what the screen shows, whatever it was before.
  | { type: "excludeForksChanged"; excludeForks: RepoFilters["excludeForks"] }
  | {
      type: "favouritesOnlyChanged";
      favouritesOnly: RepoFilters["favouritesOnly"];
    }
  | { type: "cleared" }; // no data: the reducer knows the defaults

export const DEFAULT_FILTERS: RepoFilters = {
  query: "",
  language: null,
  sort: "updated",
  excludeForks: false,
  favouritesOnly: false,
};

export function filtersReducer(
  state: RepoFilters,
  action: FiltersAction,
): RepoFilters {
  switch (action.type) {
    case "queryChanged":
      return { ...state, query: action.query };
    case "languagePicked":
      return { ...state, language: action.language };
    case "sortChanged":
      return { ...state, sort: action.sort };
    case "excludeForksChanged":
      return { ...state, excludeForks: action.excludeForks };
    case "favouritesOnlyChanged":
      return { ...state, favouritesOnly: action.favouritesOnly };
    case "cleared":
      return DEFAULT_FILTERS;

    default: {
      const unreachable: never = action;
      throw new Error(`Unknown action: ${JSON.stringify(unreachable)}`);
    }
  }
}
