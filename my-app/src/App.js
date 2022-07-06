import './App.css';
import { Hero } from "./components/Hero";
import { Feed } from "./components/shared/Feed";
import { Piece } from "./components/Piece";
import { Gallery } from "./components/Gallery";
import { Nav } from "./components/Nav";
import { Dream } from "./components/Dream"
import { Color } from './components/Color';
import { Search } from './components/Search';
import { Recent } from './components/Recent';
import { AgentStatus } from './components/AgentStatus';
import { Jobs } from './components/Jobs';

import { useAuth0 } from "@auth0/auth0-react";
import { ChakraProvider, Box } from '@chakra-ui/react'
import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";

function App() {
  // TODO: Is something going to happen with this?
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [token, setToken] = useState("badtoken");
  
  const getToken = async()=>{
    let token
    try{
      token = await getAccessTokenSilently({
        audience : "https://api.feverdreams.app/"
      })
      console.log(token)
      setToken(token)
    }catch(e){
      console.log("Not logged in")
    }
  }

  useEffect(()=>{
    getToken()
  })

  return (
    <ChakraProvider>
      <Router>
        <div className='App'>
          <Nav />
          <Box p={5} width={"100%"}>
            {/* A <Switch> looks through its children <Route>s and
                renders the first one that matches the current URL. */}
            <Routes>
              <Route path={"/gallery/:user_id/:amount/:page"} element={<Gallery />} />
              <Route path={"/piece/:uuid"} element = {<Piece />} />
              <Route path="/random" element={<Feed type="random" amount="20" />}>
                <Route path=":amount" element={<Feed type="random"/>} />
                <Route path="" element={<Feed type="random" amount="20" />} />
              </Route>
              <Route path="/recent" element={<Recent amount="20" />}>
                <Route path=":amount" element={<Recent />}>
                  <Route path=":page" element={<Recent />} />
                </Route>
                <Route path="" element={<Feed type="random" amount="20" />} />
              </Route>
              <Route path="/" element={<Hero />} />
              <Route path="/agentstatus" element={<AgentStatus />}></Route>
              <Route path="/jobs" element={<Jobs />}></Route>
              <Route path="/dream" element={<Dream token={token} isAuthenticated={isAuthenticated}/>}></Route>
              
              <Route path="/rgb/:r/:g/:b" element={<Color />}>
                <Route path=":range" element={<Color />}>
                  <Route path=":amount" element={<Color />}>
                    <Route path=":page" element={<Color />} />
                  </Route>
                </Route>
              </Route>
              <Route path="/search/:regexp" element={<Search />}>
                <Route path=":amount" element={<Search />}>
                  <Route path=":page" element={<Search />} />
                </Route>
              </Route>
            </Routes>
          </Box>
        </div>
      </Router>
    </ChakraProvider>
  );
}

export default App;
