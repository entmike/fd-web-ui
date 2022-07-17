import { useAuth0 } from "@auth0/auth0-react"
import { ChakraProvider, Box } from "@chakra-ui/react"
import { useState, useEffect } from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

import "./App.css"

import { Nav } from "./components/shared/Nav"

import { Hero } from "./components/Pages/HomePage"
import UserGalleryPage from "./components/Pages/UserGalleryPage"
import RandomGalleryPage from "./components/Pages/RandomGalleryPage"
import RecentGalleryPage from "./components/Pages/RecentGalleryPage"
import MutatePage from "./components/Pages/MutatePage"
import CreateDreamPage from "./components/Pages/CreateDreamPage"
import JobsPage from "./components/Pages/JobsPage"
import PiecePage from "./components/Pages/PiecePage"
import AgentStatusPage from "./components/Pages/AgentStatusPage"
import ColorPage from "./components/Pages/ColorPage"
import JobGenerator from "./components/Pages/JobGenerator"
import FollowingPage from "./components/Pages/FollowingPage"

import SearchPage from "./components/Pages/SearchPage"
import algoliasearch from "algoliasearch/lite"

import { InstantSearch } from "react-instantsearch-hooks-web"

const searchClient = algoliasearch("SBW45H5QPH", "735cfe2686474a143a610f864474b2f2")

function App() {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0()
  const [token, setToken] = useState("badtoken")

  const getToken = async () => {
    let token

    try {
      token = await getAccessTokenSilently({
        audience: "https://api.feverdreams.app/",
      })

      setToken(token)
    } catch (e) {
      console.log("Not logged in")
    }
  }

  useEffect(() => {
    getToken()
  })

  return (
    <ChakraProvider>
      <InstantSearch searchClient={searchClient} indexName="feverdreams">
        <Router>
          <div className="App">
            <Nav />
            <Box p={5} width={"100%"}>
              <Routes>
                {/* Gallery pages */}
                <Route path={"/gallery/:user_id/:page"} element={<UserGalleryPage token={token} isAuthenticated={isAuthenticated}/>} />
                <Route path="/random" element={<RandomGalleryPage />} />
                <Route path="/recent/:page" element={<RecentGalleryPage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/rgb/:r/:g/:b/:range/:amount/:page" element={<ColorPage />} />

                {/* Non-gallery pages */}
                <Route path="/" element={<Hero />} />
                <Route
                  path={'/piece/:uuid'}
                  element={<PiecePage token={token} />}
                />
                <Route path="/jobs" element={<JobsPage />}></Route>
                <Route
                  path="/dream"
                  element={<CreateDreamPage token={token} isAuthenticated={isAuthenticated} />}
                />
                <Route
                  path="/mutate/:uuid"
                  element={<MutatePage token={token} isAuthenticated={isAuthenticated} />}
                />
                <Route path="/job-generator" element={<JobGenerator />} />
                <Route path="/agentstatus" element={<AgentStatusPage />} />
                <Route path="/following" token={token} element={<FollowingPage token={token} isAuthenticated={isAuthenticated}/>} />
              </Routes>
            </Box>
          </div>
        </Router>
      </InstantSearch>
    </ChakraProvider>
  )
}

export default App
