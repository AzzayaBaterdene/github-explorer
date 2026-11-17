import type { FiltersAction } from "../lib/filtersReducer";
import type { RepoFilters } from "../lib/repoFilters";
import { SORTS, SORT_LABELS, isSort } from "../lib/sorts";

type RepoToolbarProps = {
  filters: RepoFilters;
  languages: string[];
  // onChange: (next: RepoFilters) => void;
  onAction: (action: FiltersAction) => void;
};

export function RepoToolbar({
  filters,
  languages,
  onAction,
}: RepoToolbarProps) {
  return (
    <div className="repo-toolbar">
      <label>
        Filter
        <input
          type="search"
          placeholder="Name or description"
          value={filters.query}
          onChange={(e) =>
            onAction({ type: "queryChanged", query: e.target.value })
          }
        />
      </label>
      <label>
        Language
        <select
          value={filters.language ?? ""}
          onChange={(e) =>
            onAction({
              type: "languagePicked",
              language: e.target.value === "" ? null : e.target.value,
            })
          }
        >
          <option value="">All languages</option>
          {languages.map((language) => (
            <option key={language} value={language}>
              {language}
            </option>
          ))}
        </select>
      </label>
      <label>
        Sort
        <select
          value={filters.sort}
          onChange={(e) => {
            const value = e.target.value; // string
            if (isSort(value)) onAction({ type: "sortChanged", sort: value }); // value: Sort
          }}
        >
          {SORTS.map((sort) => (
            <option key={sort} value={sort}>
              {SORT_LABELS[sort]}
            </option>
          ))}
        </select>
      </label>
      <label>
        <input
          type="checkbox"
          checked={filters.excludeForks}
          onChange={(e) =>
            onAction({
              type: "excludeForksChanged",
              excludeForks: e.target.checked,
            })
          }
        />
        Exclude forks
      </label>
      <label>
        <input
          type="checkbox"
          checked={filters.favouritesOnly}
          onChange={(e) =>
            onAction({
              type: "favouritesOnlyChanged",
              favouritesOnly: e.target.checked,
            })
          }
        />
        Favourites only
      </label>

      <button type="button" onClick={() => onAction({ type: "cleared" })}>
        Clear
      </button>
    </div>
  );
}
