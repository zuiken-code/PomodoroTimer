import React from "react";
import ReactDOM from "react-dom/client";
import Root from "./Root";
import "./index.css";
import { HashRouter as Router } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Router>
      <Root />
    </Router>
  </React.StrictMode>,
);
