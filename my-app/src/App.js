import { useAuth0 } from "@auth0/auth0-react"
import { ChakraProvider, Box } from "@chakra-ui/react"
import { useState, useEffect } from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

import "./App.css"

import { Nav } from "./components/shared/Nav"
import { FdFooter } from "./components/shared/FdFooter.js"

import { Hero } from "./components/Pages/HomePage"
import UserGalleryPage from "./components/Pages/UserGalleryPage"
import RandomGalleryPage from "./components/Pages/RandomGalleryPage"
import RecentGalleryPage from "./components/Pages/RecentGalleryPage"
import MutatePage from "./components/Pages/MutatePage"
import MutateStablePage from "./components/Pages/MutateStablePage"
import IncubatePage from "./components/Pages/MutatePage"
import CreateDreamPage from "./components/Pages/CreateDreamPage"
import JobsPage from "./components/Pages/JobsPage"
import MyJobsPage from "./components/Pages/MyJobsPage"
import PiecePage from "./components/Pages/PiecePage"
import AgentStatusPage from "./components/Pages/AgentStatusPage"
import AgentJobsPage from "./components/Pages/AgentJobsPage"
import ColorPage from "./components/Pages/ColorPage"
import JobGenerator from "./components/Pages/JobGenerator"
import FollowingPage from "./components/Pages/FollowingPage"
import MyProfile from "./components/Pages/MyProfile"
import MyUploads from "./components/Pages/MyUploads"

import SearchPage from "./components/Pages/SearchPage"
import algoliasearch from "algoliasearch/lite"

import { InstantSearch } from "react-instantsearch-hooks-web"
import MyLikesPage from "components/Pages/MyLikesPage"

const searchClient = algoliasearch("SBW45H5QPH", "735cfe2686474a143a610f864474b2f2")

function App() {
  const {user, isAuthenticated, getAccessTokenSilently } = useAuth0()
  const [token, setToken] = useState(null)
  const [userId, setUserId] = useState(null)
  const getToken = async () => {
    let token

    try {
      token = await getAccessTokenSilently({
        audience: "https://api.feverdreams.app/",
      })

      setToken(token)
      if(user){
        let userId = user.sub.split("|")[2]
        setUserId(userId)
      }
    } catch (e) {
      console.log("Not logged in")
    }
  }

  useEffect(() => {
    getToken()
  },[user,isAuthenticated])

  return (
    <ChakraProvider>
      <InstantSearch searchClient={searchClient} indexName="feverdreams">
        <Router>
          <div className="App">
            <Nav />
            <Box p={5} width={"100%"}>
              <Routes>
                {/* Gallery pages */}
                <Route path={"/gallery/:user_id/:page"} element={<UserGalleryPage token={token} isAuthenticated={isAuthenticated} user={userId}/>} />
                <Route path="/random/:type/:amount" element={<RandomGalleryPage token={token} isAuthenticated={isAuthenticated} user={userId}/>} />
                <Route path="/recent/:page" element={<RecentGalleryPage token={token} isAuthenticated={isAuthenticated} user={userId}/>} />
                <Route path="/recent/:type/:page" element={<RecentGalleryPage token={token} isAuthenticated={isAuthenticated} user={userId}/>} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/rgb/:r/:g/:b/:range/:amount/:page" element={<ColorPage />} />

                {/* Non-gallery pages */}
                <Route path="/" element={<Hero />} />
                <Route
                  path={'/piece/:uuid'}
                  element={<PiecePage token={token} isAuthenticated={isAuthenticated} user={userId}/>}
                />
                <Route path="/jobs" element={<JobsPage />}></Route>
                <Route path="/myjobs/:status/:page" element={<MyJobsPage token={token} isAuthenticated={isAuthenticated}/>}></Route>
                <Route path="/myfavs/:page" element={<MyLikesPage token={token} isAuthenticated={isAuthenticated}/>}></Route>
                <Route
                  path="/dream"
                  element={<CreateDreamPage token={token} isAuthenticated={isAuthenticated} />}
                />
                <Route
                  path="/mutate/:uuid"
                  element={<MutateStablePage mode="mutate" token={token} isAuthenticated={isAuthenticated} />}
                />
                <Route
                  path="/edit/:uuid"
                  element={<MutateStablePage mode="edit" token={token} isAuthenticated={isAuthenticated} user={userId}/>}
                />
                {/* <Route
                  path="/mutate/:uuid"
                  element={<MutatePage mode="mutate" token={token} isAuthenticated={isAuthenticated} />}
                />
                <Route
                  path="/edit/:uuid"
                  element={<MutatePage mode="edit" token={token} isAuthenticated={isAuthenticated} />}
                />
                <Route
                  path="/incubate/:uuid"
                  element={<IncubatePage token={token} isAuthenticated={isAuthenticated} />}
                /> */}
                <Route path="/job-generator" element={<JobGenerator />} />
                <Route path="/agentstatus" element={<AgentStatusPage />} />
                <Route path="/agentstatus/:agent/:page" element={<AgentJobsPage />} />
                <Route path="/following" token={token} element={<FollowingPage token={token} isAuthenticated={isAuthenticated}/>} />
                <Route path="/myprofile" token={token} element={<MyProfile token={token} isAuthenticated={isAuthenticated}/>} />
                <Route path="/myuploads" token={token} element={<MyUploads token={token} isAuthenticated={isAuthenticated}/>} />
              </Routes>
            </Box>
            <FdFooter />
          </div>
        </Router>
      </InstantSearch>
    </ChakraProvider>
  )
}

export default App
