import type { Repo } from "../lib/github-types";
import { RepoCard } from "./RepoCard";

type RepoListProps = {
  repos: Repo[];
  favouriteIds: number[];
  onToggleFavourite: (id: number) => void;
};

export function RepoList({
  repos,
  favouriteIds,
  onToggleFavourite,
}: RepoListProps) {
  if (repos.length === 0) {
    return <p className="muted">No repositories found.</p>;
  }

  return (
    <ul className="repo-list">
      {repos.map((repo) => (
        <li key={repo.id}>
          <RepoCard
            repo={repo}
            isFavourite={favouriteIds.includes(repo.id)}
            onToggleFavourite={onToggleFavourite}
          />
        </li>
      ))}
    </ul>
  );
}
