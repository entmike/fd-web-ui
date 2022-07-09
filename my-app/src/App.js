import { useAuth0 } from '@auth0/auth0-react';
import { ChakraProvider, Box } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './App.css';

import { Nav } from './components/Nav';

import { Hero } from './components/Pages/HomePage';
import UserGalleryPage from './components/Pages/UserGalleryPage';
import RandomGalleryPage from './components/Pages/RandomGalleryPage';
import RecentGalleryPage from './components/Pages/RecentGalleryPage';

import CreateDreamPage from './components/Pages/CreateDreamPage';
import JobsPage from './components/Pages/JobsPage';
import PiecePage from './components/Pages/PiecePage';
import AgentStatusPage from './components/Pages/AgentStatusPage';
import ColorPage from './components/Pages/ColorPage';

import { Search } from './components/Pages/Search';

function App() {
  // TODO: Is something going to happen with this?
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [token, setToken] = useState('badtoken');

  const getToken = async () => {
    let token;

    try {
      token = await getAccessTokenSilently({
        audience: 'https://api.feverdreams.app/',
      });

      setToken(token);
    } catch (e) {
      console.log('Not logged in');
    }
  };

  useEffect(() => {
    getToken();
  });

  return (
    <ChakraProvider>
      <Router>
        <div className="App">
          <Nav />
          <Box p={5} width={'100%'}>
            {/* A <Switch> looks through its children <Route>s and
                renders the first one that matches the current URL. */}
            <Routes>
              {/* Gallery pages */}
              <Route
                path={'/gallery/:user_id/:page'}
                element={<UserGalleryPage />}
              />
              <Route path="/random" element={<RandomGalleryPage />} />
              <Route path="/recent/:page" element={<RecentGalleryPage />} />

              <Route path="/search/:regexp" element={<Search />}>
                <Route path=":amount" element={<Search />}>
                  <Route path=":page" element={<Search />} />
                </Route>
              </Route>

              {/* Non-gallery pages */}
              <Route path="/" element={<Hero />} />
              <Route path={'/piece/:uuid'} element={<PiecePage />} />
              <Route path="/jobs" element={<JobsPage />}></Route>
              <Route
                path="/dream"
                element={
                  <CreateDreamPage
                    token={token}
                    isAuthenticated={isAuthenticated}
                  />
                }
              />

              <Route path="/agentstatus" element={<AgentStatusPage />}></Route>

              <Route path="/rgb/:r/:g/:b" element={<ColorPage />}>
                <Route path=":range" element={<ColorPage />}>
                  <Route path=":amount" element={<ColorPage />}>
                    <Route path=":page" element={<ColorPage />} />
                  </Route>
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
