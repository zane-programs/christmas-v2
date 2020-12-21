import React from "react";
import ReactDOM from "react-dom";
import "normalize.css";
import { BrowserRouter } from "react-router-dom";
// @ts-ignore
import PWAPrompt from "react-ios-pwa-prompt";

import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

ReactDOM.render(
  <BrowserRouter>
    <App />
    <PWAPrompt timesToShow={3} />
  </BrowserRouter>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
