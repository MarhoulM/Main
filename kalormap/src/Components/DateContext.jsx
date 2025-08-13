import { createContext, useContext } from "react";

export const DateContext = createContext();

export const useDate = () => useContext(DateContext);
