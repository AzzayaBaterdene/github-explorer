export type GitHubUser = {
    login: string;
    name: string | null;
    html_url: string;
    avatar_url: string;
    location: string | null;
    followers: number;
    following: number;
    bio: string | null;
    public_repos: number,
    blog: string | null;
}

export type Repo = {
    name: string;
    description: string | null;
    language: string | null;
    fork: boolean;
    stargazers_count: number;
    updated_at: string;
    html_url: string;
    id: number;
    full_name: string;
    topics?: string[];
}

//Keys are unknown in advance, and the object can be empty ({}). */
export type LanguageBytes = Record<string, number>;

export type RequestState<T> = 
    | {status: "idle"}
    | {status: "loading"}
    | {status: "success"; data: T}
    | {status: "error"; error: string}
