import type { RepoFilters } from "../lib/repoFilters";
import { SORTS, SORT_LABELS, isSort } from "../lib/sorts";

type RepoToolbarProps = {
  filters: RepoFilters;
  languages: string[];
  onChange: (next: RepoFilters) => void;
};

export function RepoToolbar({
  filters,
  languages,
  onChange,
}: RepoToolbarProps) {
  return (
    <div className="repo-toolbar">
      <label>
        Filter
        <input
          type="search"
          placeholder="Name or description"
          value={filters.query}
          onChange={(e) => onChange({ ...filters, query: e.target.value })}
        />
      </label>
      <label>
        Language
        <select
          value={filters.language ?? ""}
          onChange={(e) =>
            onChange({
              ...filters,
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
            if (isSort(value)) onChange({ ...filters, sort: value }); // value: Sort
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
            onChange({ ...filters, excludeForks: e.target.checked })
          }
        />
        Exclude forks
      </label>
    </div>
  );
}
