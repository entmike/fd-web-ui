import React from 'react';
import './index.css';
import App from './App';
import theme from './theme'
import { ColorModeScript } from '@chakra-ui/react'
import { createRoot } from 'react-dom/client';
import { Auth0Provider } from "@auth0/auth0-react";

let app = document.getElementById('root');
if (app) {
  createRoot(app).render(<>
  <ColorModeScript initialColorMode={theme.config.initialColorMode} />
  <Auth0Provider
    domain="dev-yqzsn326.auth0.com"
    clientId="dlt683RKXoT6tDOHCa8wWQQaoHobcjQm"
    redirectUri={window.location.origin}
    useRefreshTokens={ true }
    cacheLocation="localstorage"
  >
    <App />
  </Auth0Provider>
  </>
  );
}