import type { Repo } from "../lib/github-types";
import { RepoCard } from "./RepoCard";

type RepoListProps = {repos: Repo[]}


export function RepoList ({ repos }: RepoListProps) {
    if(repos.length === 0){
        return <p className="muted">No repositories found.</p>
    }

   return (
        <ul className="repo-list">
            {repos.map((repo) => (
                <li key={repo.id}>
                    <RepoCard repo={repo} />
                </li>
            ))}
        </ul>
   )
}