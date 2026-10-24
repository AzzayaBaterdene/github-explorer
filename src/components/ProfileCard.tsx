import { Avatar } from "./Avatar";
import { StatBadge } from "./StatBadge";
import type { GitHubUser } from "../lib/github-types";

type ProfileCardProps = { user: GitHubUser };

export function ProfileCard({ user }: ProfileCardProps) {
  return (
    <div className="profile-card">
      <Avatar src={user.avatar_url} alt={`${user.login}'s avatar`} />
      <p className="user-name">{user.name ?? user.login}</p>          {/* ← fallback when name is null */}
      {user.bio && <p className="profile-card-bio">{user.bio}</p>}   {/* ← the bio text was missing */}
      <div className="profile-card-stats">
        {user.location && <span className="location">{user.location}</span>}
        <StatBadge label="Followers" value={user.followers} />
        <StatBadge label="Following" value={user.following} />       {/* ← was missing */}
        <StatBadge label="Public repos" value={user.public_repos} />
      </div>
    </div>
  );
}