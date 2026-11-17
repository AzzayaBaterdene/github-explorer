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
    return <p className="text-muted">No repositories found.</p>;
  }

  return (
    // The list owns the separators between cards, the same rule as spacing
    <ul className="divide-y divide-border">
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
