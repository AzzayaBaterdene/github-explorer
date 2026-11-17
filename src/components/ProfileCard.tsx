import { Avatar } from "./Avatar";
import { StatBadge } from "./StatBadge";
import type { GitHubUser } from "../lib/github-types";

type ProfileCardProps = { user: GitHubUser; favouriteCount: number };

export function ProfileCard({ user, favouriteCount }: ProfileCardProps) {
  return (
    <div className="flex items-start gap-4">
      {/* Decorative: the name is printed right next to it, so alt text would repeat it */}
      <Avatar src={user.avatar_url} alt="" />

      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <p className="text-lg font-semibold">{user.name ?? user.login}</p>
        {user.bio && <p className="break-words">{user.bio}</p>}
        {user.location && <p className="text-sm text-muted">{user.location}</p>}

        <ul className="flex flex-wrap gap-2">
          <li>
            <StatBadge label="Followers" value={user.followers} />
          </li>
          <li>
            <StatBadge label="Following" value={user.following} />
          </li>
          <li>
            <StatBadge label="Public repos" value={user.public_repos} />
          </li>
          {/* > 0, not a bare favouriteCount: with 0, `0 && …` renders a "0" on the page */}
          {favouriteCount > 0 && (
            <li>
              <StatBadge label="Favourites" value={favouriteCount} />
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
