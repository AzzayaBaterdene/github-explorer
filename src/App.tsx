import './App.css'
import { Avatar } from './components/Avatar'
import { StatBadge } from './components/StatBadge'
import { RepoCard } from './components/RepoCard'
import { Card } from './components/Card'
// import RenderTest from '../practises/Day3/RenderTest'
import userJson from "./fixtures/user.json";
import reposJson from "./fixtures/repos.json";
import type { GitHubUser, Repo } from "./lib/github-types";
import { ProfileCard } from './components/ProfileCard'
import { RepoList } from './components/RepoList'

const user: GitHubUser = userJson;
const repos: Repo[] = reposJson;
const reposTest: Repo[] = [];

type ReposJsonType = typeof reposJson;
// type UserJsonType = typeof userJson;  // It checked that this inferred type fits into Repo[]. It does.
// type D = ReposJsonType[number]["description"]; // A trick to ask for exactly one field

function App() {
  return (
    <>
      <header>
        <h1>GitHub Explorer by Azzaya</h1>
        <b><p>{user.login} has {repos.length} repos in the fixture</p></b>
        <form role="search" onSubmit={(e) => e.preventDefault()}>
          <label htmlFor="user-search" className="visually-hidden">
            GitHub username
          </label>
          <input
            id="user-search"
            type="search"
            name="login"
            placeholder="Search a GitHub user…"
            autoComplete="off"
          />
          <button type="submit">Search</button>
        </form>
      </header>

      <main>
        {/* Step 4: Avatar, StatBadge and RepoCard demos go here */}
         <Card title='Profile'>
          <ProfileCard user={user}/>
        </Card>
        <Card title={`Repositories (${repos.length})`}>
          {/* {repos[0] && <RepoCard repo={repos[0]} /> } */}
          <RepoList repos={reposTest}/>
          {/* <RepoList repos={repos}/> */}
        </Card>
      </main>
        
      <footer>
        <p>
          Data from the{" "}
          <a href="https://docs.github.com/en/rest" target="_blank" rel="noreferrer">
            GitHub REST API
          </a>
        </p>
      </footer>
    </>
  )

  // For test purpose!!
  // return (
  //   <RenderTest/>
  // )
}

export default App
