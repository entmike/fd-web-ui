import React from 'react';
import './index.css';
import App from './App';
import theme from './theme'
import { ColorModeScript } from '@chakra-ui/react'
import reportWebVitals from './reportWebVitals';
import { createRoot } from 'react-dom/client';
import { createBrowserHistory } from 'history';

let app = document.getElementById('root');
if (app) {
  // 1. Set up the browser history with the updated location
  // (minus the # sign)
  // eslint-disable-next-line no-restricted-globals
  const replaceHashPath = () => {
    const history = createBrowserHistory()
    const hash = history.location.hash
    if (hash) {
      const path = hash.replace(/^#/, '')
      if (path) {
        history.replace(path)
      }
    }
  }
  replaceHashPath()
  createRoot(app).render(<>
  <ColorModeScript initialColorMode={theme.config.initialColorMode} />
  <App />
  </>
  );
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
