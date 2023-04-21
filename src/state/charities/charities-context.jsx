import { createContext } from "react";

export const CharitiesContext = createContext({
  myCharities: [],
  income: [],
  maaser: 0,
});
