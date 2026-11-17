import "./App.css";
import { useState } from "react";
import { SearchForm } from "./components/SearchForm";
import { UserPage } from "./components/UserPage";
import { MOCKS_ENABLED } from "./mocks/flag";

function App() {
  const [login, setLogin] = useState("octocat");

  return (
    <>
      <header>
        <h1>GitHub Explorer by Azzaya</h1>
        <SearchForm onSearch={(value) => setLogin(value.toLowerCase())} />
        {MOCKS_ENABLED && <span className="mock-badge">Mock data</span>}
      </header>

      <main>
        {/* Decision: key={login}, so each user gets a fresh UserPage.
            Wanted: a new user starts with no filters and in "loading", and the previous
            user's profile can't show for even one frame. Trade-off: everything inside
            resets, including filters, which is what I want when the user changes. */}
        <UserPage key={login} login={login} />
      </main>

      <footer>
        <p>
          Data from the{" "}
          <a
            href="https://docs.github.com/en/rest"
            target="_blank"
            rel="noreferrer"
          >
            GitHub REST API
          </a>
        </p>
      </footer>
    </>
  );
}

export default App;
