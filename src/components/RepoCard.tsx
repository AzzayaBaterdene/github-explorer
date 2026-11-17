import { formatCount, timeAgo } from "../lib/format";
import type { Repo } from "../lib/github-types";

type RepoCardProps = {
  repo: Repo;
  onToggleFavourite: (id: number) => void;
  isFavourite: boolean;
};

export function RepoCard({ repo, onToggleFavourite, isFavourite }: RepoCardProps) {
  return (
    <div className="flex flex-col gap-2 py-3">
      <div className="flex items-start justify-between gap-3">
        <h3 className="min-w-0 break-words font-semibold">
          <a
            href={repo.html_url}
            target="_blank"
            rel="noreferrer"
            className="text-accent underline-offset-2 hover:underline"
          >
            {repo.name}
            {/* A new tab is a surprise for screen-reader users unless it's announced */}
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </h3>

        <button
          type="button"
          onClick={() => onToggleFavourite(repo.id)}
          aria-pressed={isFavourite}
          aria-label={`Favourite ${repo.name}`}
          className={`grid size-9 shrink-0 place-items-center rounded-md text-lg hover:bg-bg ${
            isFavourite ? "text-warning" : "text-muted"
          }`}
        >
          {isFavourite ? "★" : "☆"}
        </button>
      </div>

      {repo.description ? (
        <p className="break-words">{repo.description}</p>
      ) : (
        <p className="italic text-muted">No description</p>
      )}

      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted">
        {repo.language && (
          <span className="inline-flex items-center gap-1">
            <span aria-hidden="true" className="size-2.5 rounded-full bg-muted" />
            {repo.language}
          </span>
        )}
        <span>
          <span aria-hidden="true">⭐ </span>
          {formatCount(repo.stargazers_count)}
          <span className="sr-only"> stars</span>
        </span>
        <span>
          <span aria-hidden="true">🍴 </span>
          {formatCount(repo.forks_count)}
          <span className="sr-only"> forks</span>
        </span>
        <span>Updated {timeAgo(repo.updated_at)}</span>
      </div>
    </div>
  );
}