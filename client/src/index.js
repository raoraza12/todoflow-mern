import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { TodoProvider } from "./context/TodoContext";
import { PushProvider } from "./context/PushContext";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <PushProvider>
      <TodoProvider>
        <App />
      </TodoProvider>
    </PushProvider>
  </React.StrictMode>
);