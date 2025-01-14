import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { RootStoreProvider } from "./store/RootStoreContext.tsx";

createRoot(document.getElementById("root")!).render(
  <RootStoreProvider>
    <StrictMode>
      <App />
    </StrictMode>
  </RootStoreProvider>
);
