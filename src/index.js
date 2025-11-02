import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import Bookstore from './Store/Bookstore';
import {BrowserRouter} from 'react-router-dom';
import FirebaseContextProvider from './Context/FirebaseContext.js'
import CloudinaryContextProvider from './Context/CloudinaryContext.js';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
    
      <FirebaseContextProvider>
        <BrowserRouter>
            <Provider store={Bookstore}>
              <CloudinaryContextProvider>
                 <App />
              </CloudinaryContextProvider>
            </Provider>
        </BrowserRouter>
      </FirebaseContextProvider>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
