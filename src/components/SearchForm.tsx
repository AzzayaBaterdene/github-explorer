import type { FormEvent } from "react";

type SearchFormProps = { onSearch: (login: string) => void };

export function SearchForm({ onSearch }: SearchFormProps) {
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const value = new FormData(e.currentTarget).get("login"); // string | File | null
    if (typeof value !== "string" || value.trim() === "") return;
    onSearch(value.trim());
  }

  return (
    <form role="search" onSubmit={handleSubmit}>
      <label htmlFor="user-search" className="visually-hidden">GitHub username</label>
      <input id="user-search" type="search" name="login" placeholder="Search a GitHub user…" autoComplete="off" />
      <button type="submit">Search</button>
    </form>
  );
}


