import { useReducer } from "react";
import type { Repo } from "../lib/github-types";
import { filterAndSortRepos, languageOptions } from "../lib/repoFilters";
import { RepoToolbar } from "./RepoToolbar";
import { RepoList } from "./RepoList";
import { DEFAULT_FILTERS, filtersReducer } from "../lib/filtersReducer";

type RepoBrowserProps = {
  repos: Repo[];
  favouriteIds: number[];
  onToggleFavourite: (id: number) => void;
};

export function RepoBrowser({ repos, favouriteIds, onToggleFavourite }: RepoBrowserProps) {
  const [filters, dispatch] = useReducer(filtersReducer, DEFAULT_FILTERS);

  if (repos.length === 0) {
    return <p className="text-muted">This user has no public repositories.</p>;
  }

  // derived during render: never stored, so never stale
  const visible = filterAndSortRepos(repos, filters, favouriteIds);
  const languages = languageOptions(repos);

  return (
    // The parent owns the spacing between toolbar, count and list
    <div className="flex flex-col gap-4">
      <RepoToolbar filters={filters} languages={languages} onAction={dispatch} />
      <p className="text-sm text-muted">
        Showing {visible.length} of {repos.length}
      </p>
      {visible.length === 0 ? (
        <p className="text-muted">No repositories match your filters.</p>
      ) : (
        <RepoList
          repos={visible}
          favouriteIds={favouriteIds}
          onToggleFavourite={onToggleFavourite}
        />
      )}
    </div>
  );
}