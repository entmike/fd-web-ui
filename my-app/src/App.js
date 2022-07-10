import { useAuth0 } from '@auth0/auth0-react';
import { ChakraProvider, Box } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './App.css';

import { Nav } from './components/shared/Nav';

import { Hero } from './components/Pages/HomePage';
import UserGalleryPage from './components/Pages/UserGalleryPage';
import RandomGalleryPage from './components/Pages/RandomGalleryPage';
import RecentGalleryPage from './components/Pages/RecentGalleryPage';
import MutatePage from './components/Pages/MutatePage';
import CreateDreamPage from './components/Pages/CreateDreamPage';
import JobsPage from './components/Pages/JobsPage';
import PiecePage from './components/Pages/PiecePage';
import AgentStatusPage from './components/Pages/AgentStatusPage';
import ColorPage from './components/Pages/ColorPage';

import SearchPage from './components/Pages/SearchPage';

function App() {
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
            <Routes>
              {/* Gallery pages */}
              <Route
                path={'/gallery/:user_id/:page'}
                element={<UserGalleryPage />}
              />
              <Route path="/random" element={<RandomGalleryPage />} />
              <Route path="/recent/:page" element={<RecentGalleryPage />} />
              <Route path="/search/:regexp/:page" element={<SearchPage />} />
              <Route
                path="/rgb/:r/:g/:b/:range/:amount/:page"
                element={<ColorPage />}
              />

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
              <Route
                path="/mutate/:uuid"
                element={
                  <MutatePage token={token} isAuthenticated={isAuthenticated} />
                }
              />

              <Route path="/agentstatus" element={<AgentStatusPage />} />
            </Routes>
          </Box>
        </div>
      </Router>
    </ChakraProvider>
  );
}

export default App;
