import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RootStoreProvider } from "./store/RootStoreContext.tsx";
import AppWrapper from "./AppWrapper.tsx";

createRoot(document.getElementById("root")!).render(
  <RootStoreProvider>
    <StrictMode>
      <AppWrapper />
    </StrictMode>
  </RootStoreProvider>
);
