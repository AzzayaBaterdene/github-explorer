// import './App.css'
// // import { Avatar } from './components/Avatar'
// // import { StatBadge } from './components/StatBadge'
// // import { RepoCard } from './components/RepoCard'
// import { Card } from './components/Card'
// // import RenderTest from '../practises/Day3/RenderTest'
// // import userJson from "./fixtures/user.json";
// // import reposJson from "./fixtures/repos.json";
// import type { GitHubUser, Repo } from "./lib/github-types";
// import { ProfileCard } from './components/ProfileCard'
// import { RepoList } from './components/RepoList'
// import { useState } from 'react';
// import { FIXTURES } from './fixtures';
// import { SearchForm } from './components/SearchForm';
// // import { UserPropsDrill } from './components/BlankDrill';

// // const user: GitHubUser = userJson;
// // const repos: Repo[] = reposJson;
// // const reposTest: Repo[] = [];
// // const userLists = [
// //     {id: 1, name: "Zaya", role: "admin" },
// //     {id: 2, name: "Alex", role: "manager" },
// //     {id: 3, name: "May", role: "intern" }
// // ]

// // type ReposJsonType = typeof reposJson;
// // type UserJsonType = typeof userJson;  // It checked that this inferred type fits into Repo[]. It does.
// // type D = ReposJsonType[number]["description"]; // A trick to ask for exactly one field

// function App() {
//   const [login, setLogin] = useState("octocat");
//   const profile = FIXTURES[login];   // Profile | undefined

//   return (
//     <>
//       <header>
//         <h1>GitHub Explorer by Azzaya</h1>
//         <b><p>{user.login} has {repos.length} repos in the fixture</p></b>
//         <form role="search" onSubmit={(e) => e.preventDefault()}>
//           <label htmlFor="user-search" className="visually-hidden">
//             GitHub username
//           </label>
//           <input
//             id="user-search"
//             type="search"
//             name="login"
//             placeholder="Search a GitHub user…"
//             autoComplete="off"
//           />
//           <button type="submit">Search</button>
//         </form>
//       </header>

//       <main>
//         {/* Step 4: Avatar, StatBadge and RepoCard demos go here */}
//          {/* <Card title='Profile'>
//           <ProfileCard user={user}/>
//         </Card>
//         <Card title={`Repositories (${repos.length})`}> */}
//           {/* {repos[0] && <RepoCard repo={repos[0]} /> } */}
//           {/* <RepoList repos={reposTest}/> */}
//           {/* <RepoList repos={repos}/>
//         </Card> */}
//         <SearchForm onSearch={(value) => setLogin(value.toLowerCase())} />

//         {profile ? (
//           <>
//             <Card title="Profile" action={…}><ProfileCard user={profile.user} /></Card>
//             <Card title="Repositories"><RepoBrowser key={login} repos={profile.repos} /></Card>
//           </>
//         ) : (
//           <p className="muted">No fixture data for “{login}”. Try octocat or gaearon.</p>
//         )}
//       </main>

//       {/* <UserPropsDrill users={userLists}/>   */}
//       <footer>
//         <p>
//           Data from the{" "}
//           <a href="https://docs.github.com/en/rest" target="_blank" rel="noreferrer">
//             GitHub REST API
//           </a>
//         </p>
//       </footer>
//     </>
//   )

//   // For test purpose!!
//   // return (
//   //   <RenderTest/>
//   // )
// }

// export default App
