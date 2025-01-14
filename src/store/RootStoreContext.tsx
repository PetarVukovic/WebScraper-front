import React, { createContext, useContext } from "react";
import { rootStore } from "./rootStore";
const RootStoreContext = createContext(rootStore);

export const RootStoreProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <RootStoreContext.Provider value={rootStore}>
    {children}
  </RootStoreContext.Provider>
);

export const useRootStore = () => useContext(RootStoreContext);
