import "./App.css";
import { useState } from "react";
import { Card } from "./components/Card";
import { ProfileCard } from "./components/ProfileCard";
import { RepoList } from "./components/RepoList";
import { SearchForm } from "./components/SearchForm";
import { FIXTURES } from "./fixtures";
// import { ColorPicker } from "./components/ColorPicker";

function App() {
  const [login, setLogin] = useState("octocat");
//   const [theme, setTheme] = useState("none");

  const profile = FIXTURES[login]; // Profile | undefined

  return (
    <>
      <header>
        <h1>GitHub Explorer by Azzaya</h1>
        <SearchForm onSearch={(value) => setLogin(value.toLowerCase())} />
        {/* <ColorPicker onPick={(chosen) => setTheme(`${chosen}!`)}/> */}
        {/* <p>{theme}</p> */}
      </header>

      <main>
        {profile ? (
          <>
            <Card
              title="Profile"
              action={<a href={profile.user.html_url} target="_blank" rel="noreferrer">View on GitHub</a>}
            >
              <ProfileCard user={profile.user} />
            </Card>
            <Card title={`Repositories (${profile.repos.length})`}>
              <RepoList repos={profile.repos} />
            </Card>
          </>
        ) : (
          <p className="muted">No fixture data for “{login}”. Try octocat or gaearon.</p>
        )}
      </main>

      <footer>
        <p>
          Data from the{" "}
          <a href="https://docs.github.com/en/rest" target="_blank" rel="noreferrer">GitHub REST API</a>
        </p>
      </footer>
    </>
  );
}

export default App;