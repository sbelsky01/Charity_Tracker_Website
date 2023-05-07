import { createContext } from "react";

export const MaaserContext = createContext({
  income: [],
  monthDonations: { year: null, month: null, amount: 0 },
  yearDonations: { year: null, amount: 0 },
  maaser: 0,
});
