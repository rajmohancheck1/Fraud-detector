import React from "react";
import ReactDOM from "react-dom/client"; // Use the correct import for React 18+
import App from "./App";

// Get the root DOM node
const rootElement = document.getElementById("root");

// Create the React root
const root = ReactDOM.createRoot(rootElement);

// Render the App component
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
