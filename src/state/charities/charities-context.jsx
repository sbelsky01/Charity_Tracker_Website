import { createContext } from "react";

export const CharitiesContext = createContext({
  charities: [],
  income: [],
  maaser: 0,
});
