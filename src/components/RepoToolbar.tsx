import type { FiltersAction } from "../lib/filtersReducer";
import type { RepoFilters } from "../lib/repoFilters";
import { SORTS, SORT_LABELS, isSort } from "../lib/sorts";
import { fieldClass } from "../lib/styles";

type RepoToolbarProps = {
  filters: RepoFilters;
  languages: string[];
  onAction: (action: FiltersAction) => void;
};

// Layout classes used only in this file, written once:
// a text label above its field, or a checkbox with its label beside it
const fieldLabel = "flex flex-col gap-1 text-sm";
// py-2 matches a field's height, so the checkbox text lines up with the fields' text
const checkLabel = "flex items-center gap-2 py-2 text-sm";

export function RepoToolbar({
  filters,
  languages,
  onAction,
}: RepoToolbarProps) {
  return (
    <div className="flex flex-wrap items-end gap-3">
      <label className={`${fieldLabel} min-w-0 grow basis-48`}>
        <span className="font-medium">Filter</span>
        <input
          type="search"
          placeholder="Name or description"
          className={fieldClass}
          value={filters.query}
          onChange={(e) =>
            onAction({ type: "queryChanged", query: e.target.value })
          }
        />
      </label>

      <label className={fieldLabel}>
        <span className="font-medium">Language</span>
        <select
          className={fieldClass}
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

      <label className={fieldLabel}>
        <span className="font-medium">Sort</span>
        <select
          className={fieldClass}
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

      <label className={checkLabel}>
        <input
          type="checkbox"
          className="size-4 accent-accent"
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

      <label className={checkLabel}>
        <input
          type="checkbox"
          className="size-4 accent-accent"
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

      {/* Secondary action: an outline, not filled. Search is the one primary button. */}
      <button
        type="button"
        className="rounded-md border border-control bg-surface px-3 py-2 text-sm font-medium hover:bg-bg"
        onClick={() => onAction({ type: "cleared" })}
      >
        Clear
      </button>
    </div>
  );
}
