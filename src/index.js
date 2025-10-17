import React from 'react';
import ReactDOM from 'react-dom/client';
import './stylesheets/index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('Joint'));
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

serviceWorker.unregister();
