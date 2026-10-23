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

const user: GitHubUser = userJson;
const repos: Repo[] = reposJson;

type ReposJsonType = typeof reposJson;
type UserJsonType = typeof userJson;  // It checked that this inferred type fits into Repo[]. It does.
type D = ReposJsonType[number]["description"]; // A trick to ask for exactly one field

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
        <p>Search for a user to get started.</p>
        <Avatar src="https://m.media-amazon.com/images/S/pv-target-images/16627900db04b76fae3b64266ca161511422059cd24062fb5d900971003a0b70.jpg" alt="John Doe" size={250} />
        <StatBadge label="Followers" value={999999} />
        <StatBadge label="Following" value={45632} />
         <Card title='Profile'>
          <ProfileCard user={user}/>
        </Card>
      </main>
        <Card title='Profile'>
          <RepoCard name="example-repo" description="This is an example repository." language="TypeScript" stars={42} forks={10} />
        </Card>
      x
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
