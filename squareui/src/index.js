import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { BrowserRouter, Router, Route, Routes } from "react-router-dom";
import Setup from "./routes/setup";
//import Setup from "./routes/setup";

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
