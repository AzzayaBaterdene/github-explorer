// src/components/UserPage.tsx
// Two independent requests for one login (profile + repos), each shown in its own card.

import { useRequest } from "../hooks/useRequest";
import { GitHubError, getRepos, getUser } from "../lib/github";
import { errorMessage } from "../lib/error-message";
import type { GitHubUser, Repo, RequestState } from "../lib/github-types";
import { Card } from "./Card";
import { ProfileCard } from "./ProfileCard";
import { RepoBrowser } from "./RepoBrowser";
import { useState } from "react";

type UserPageProps = {
  login: string;
};

// Options: (a) one after the other, (b) in parallel.
// Chose (b): repos don't need anything from the profile, so the wait is the slower of the two,
// not both added together. Two RequestStates, because they can be in different states.
export function UserPage({ login }: UserPageProps) {
  const [favouriteIds, setFavouriteIds] = useState<number[]>([]);
  const favouriteCount = favouriteIds.length;

  function toggleFavourite(id: number) {
    setFavouriteIds((prev) =>
      prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id],
    );
  }

  const profile = useRequest(getUser, login); // fetch data
  const repos = useRequest(getRepos, login); // fetch data

  // If the user doesn't exist, the repos card would only repeat "No user called …".
  const userMissing =
    profile.status === "error" &&
    profile.error instanceof GitHubError &&
    profile.error.kind === "not_found";

  const layout = userMissing
    ? "grid gap-6"
    : "grid gap-6 md:grid-cols-[16rem_minmax(0,1fr)] md:items-start";

  return (
    <div className={layout}>
      <ProfileSection
        state={profile}
        login={login}
        favouriteCount={favouriteCount}
      />
      {!userMissing && (
        <ReposSection
          state={repos}
          login={login}
          favouriteIds={favouriteIds}
          onToggleFavourite={toggleFavourite}
        />
      )}
    </div>
  );
}

type SectionProps<T> = {
  state: RequestState<T>;
  login: string;
};

// A & B
type ProfileSectionProps = SectionProps<GitHubUser> & {
  favouriteCount: number;
};

type ReposSectionProps = SectionProps<Repo[]> & {
  favouriteIds: number[];
  onToggleFavourite: (id: number) => void;
};

function ProfileSection({ state, login, favouriteCount }: ProfileSectionProps) {
  switch (state.status) {
    case "idle":
    case "loading":
      return (
        <Card title="Profile">
          <p role="status">Loading profile…</p>
        </Card>
      );

    case "success":
      return (
        <Card
          title="Profile"
          action={
            <a href={state.data.html_url} target="_blank" rel="noreferrer">
              View on GitHub
            </a>
          }
        >
          <ProfileCard user={state.data} favouriteCount={favouriteCount} />
        </Card>
      );

    case "error":
      return (
        <Card title="Profile">
          <p role="alert">{errorMessage(state.error, login)}</p>
        </Card>
      );

    default: {
      const unhandled: never = state;
      return unhandled;
    }
  }
}

function ReposSection({
  state,
  login,
  favouriteIds,
  onToggleFavourite,
}: ReposSectionProps) {
  switch (state.status) {
    case "idle":
    case "loading":
      return (
        <Card title="Repositories">
          <p role="status">Loading repositories…</p>
        </Card>
      );

    case "success":
      return (
        <Card title="Repositories">
          {/* No key here: App gives UserPage key={login}, which resets everything inside it. */}
          <RepoBrowser
            repos={state.data}
            favouriteIds={favouriteIds}
            onToggleFavourite={onToggleFavourite}
          />
        </Card>
      );

    case "error":
      return (
        <Card title="Repositories">
          <p role="alert">{errorMessage(state.error, login)}</p>
        </Card>
      );

    default: {
      const unhandled: never = state;
      return unhandled;
    }
  }
}
