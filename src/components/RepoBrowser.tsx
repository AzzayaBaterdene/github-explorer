import { useState } from "react";
import type { Repo } from "../lib/github-types";
import {
  filterAndSortRepos,
  languageOptions,
  type RepoFilters,
} from "../lib/repoFilters";
import { RepoToolbar } from "./RepoToolbar";
import { RepoList } from "./RepoList";

const DEFAULT_FILTERS: RepoFilters = {
  query: "",
  language: null,
  sort: "updated",
  excludeForks: false,
};
type RepoBrowserProps = { repos: Repo[] };

export function RepoBrowser({ repos }: RepoBrowserProps) {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  if (repos.length === 0) {
    return <p className="muted">This user has no public repositories.</p>;
  }
  
  // derived during render: never stored, so never stale
  const visible = filterAndSortRepos(repos, filters);
  const languages = languageOptions(repos);
  return (
    <>
      <RepoToolbar
        filters={filters}
        languages={languages}
        onChange={setFilters}
      />
      <p className="muted">
        Showing {visible.length} of {repos.length}
      </p>
      {visible.length === 0 ? (
        <p className="muted">No repositories match your filters.</p>
      ) : (
        <RepoList repos={visible} />
      )}
    </>
  );
}
