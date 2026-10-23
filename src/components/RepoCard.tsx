import { formatCount, timeAgo } from "../lib/format";
// import { LANGUAGE_COLORS, FALLBACK_COLOR } from "../lib/languageColors";
import type { Repo } from "../lib/github-types";

type RepoCardProps = { repo: Repo };

export function RepoCard({ repo }: RepoCardProps) {
  return (
    <div className="repo-card">
      <h3 className="repo-card__name">
        <a href={repo.html_url} target="_blank" rel="noreferrer">{repo.name}</a>
      </h3>
      <p className={repo.description ? "repo-card__description" : "repo-card__description muted"}>
        {repo.description ? repo.description : "No description"}
      </p>
      <div className="repo-card__stats">
        {repo.language && (
          <span className="repo-card__language">
            <span
              className="repo-card__dot"
            //   style={{ backgroundColor: LANGUAGE_COLORS[repo.language] ?? FALLBACK_COLOR }}
            />
            {repo.language}
          </span>
        )}
        <span className="repo-card__stars">⭐ {formatCount(repo.stargazers_count)}</span>
        <span className="repo-card__forks">🍴 {formatCount(repo.forks_count)}</span>
        <span>Updated {timeAgo(repo.updated_at)}</span>
      </div>
    </div>
  );
}