import React from "react";
import ReactDOM from "react-dom";
import Root from "./Root";
import { register } from "./serviceWorker";
import "./index.css";

ReactDOM.render(<Root />, document.getElementById("root"));
register();
