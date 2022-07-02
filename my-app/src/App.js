import './App.css';
import Hero from "./Hero";
import Feed from "./Feed";
import Piece from "./Piece";
import Gallery from "./Gallery";
import Nav from "./Nav";
import Dream from "./Dream"
import Search from './Search';
import AgentStatus from './AgentStatus';
import Jobs from './Jobs';

import { useAuth0 } from "@auth0/auth0-react";
import { ChakraProvider } from '@chakra-ui/react'
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";

function App() {
  const { isAuthenticated, logout } = useAuth0();

  return (
    <ChakraProvider>
      <Router>
        <div className='App'>
          <Nav />
          {/* A <Switch> looks through its children <Route>s and
              renders the first one that matches the current URL. */}
          <Routes>
            <Route path={"/gallery/:user_id/:amount/:page"} element={<Gallery />} />
            <Route path={"/piece/:uuid"} element = {<Piece />} />
            <Route path="/random" element={<Feed type="random" amount="20" />}>
              <Route path=":amount" element={<Feed type="random"/>} />
              <Route path="" element={<Feed type="random" amount="20" />} />
            </Route>
            <Route path="/recent" element={<Feed type="recent" amount="20" />}>
              <Route path=":amount" element={<Feed type="recent"/>}>
                <Route path=":page" element={<Feed type="recent"/>} />
              </Route>
              <Route path="" element={<Feed type="random" amount="20" />} />
            </Route>
            <Route path="/" element={<Hero />} />
            <Route path="/agentstatus" element={<AgentStatus />}></Route>
            <Route path="/jobs" element={<Jobs />}></Route>
            <Route path="/dream" element={<Dream />}></Route>
            <Route path="/search/:regexp" element={<Search />}>
              <Route path=":amount" element={<Search />}>
                <Route path=":page" element={<Search />} />
              </Route>
            </Route>
          </Routes>
        </div>
      </Router>
    </ChakraProvider>
  );
}

export default App;
