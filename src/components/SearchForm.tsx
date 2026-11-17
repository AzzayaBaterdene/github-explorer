import { useId, type FormEvent } from "react";
import { fieldClass } from "../lib/styles";

type SearchFormProps = {
  onSearch: (login: string) => void;
};

export function SearchForm({ onSearch }: SearchFormProps) {
  // A unique id per instance, so two forms can never share one (concept 13)
  const inputId = useId();

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const login = String(data.get("login") ?? "").trim();
    if (!login) return;
    onSearch(login);
  }

  return (
    <form
      role="search"
      onSubmit={handleSubmit}
      className="flex grow basis-64 gap-2"
    >
      <label htmlFor={inputId} className="sr-only">
        GitHub username
      </label>
      <input
        id={inputId}
        type="search"
        name="login"
        placeholder="e.g. octocat"
        autoComplete="off"
        className={`${fieldClass} min-w-0 flex-1`}
        // className="min-w-0 flex-1 rounded-md border border-control bg-surface px-3 py-2 placeholder:text-muted"
      />
      <button
        type="submit"
        className="rounded-md bg-accent px-4 py-2 font-medium text-white hover:bg-accent-hover"
      >
        Search
      </button>
    </form>
  );
}
