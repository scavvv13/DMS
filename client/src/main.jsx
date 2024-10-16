import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { UserContextProvider } from "./contexts/UserContext.jsx";
import App from "./App.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <UserContextProvider>
      <App />
    </UserContextProvider>
  </StrictMode>
);
