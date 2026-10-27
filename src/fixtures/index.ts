import type { GitHubUser, Repo } from "../lib/github-types";
import octocatUser from "./octocat/user.json";
import octocatRepos from "./octocat/repos.json";
import gaearonUser from "./gaearon/user.json";
import gaearonRepos from "./gaearon/repos.json";

// A profile = one user + that user’s list of repos. They always belong together, so they’re grouped into one object type.
export type Profile = {
  user: GitHubUser;
  repos: Repo[];
};

export const FIXTURES: Record<string, Profile> = {
  octocat: { user: octocatUser, repos: octocatRepos },
  gaearon: { user: gaearonUser, repos: gaearonRepos },
};
