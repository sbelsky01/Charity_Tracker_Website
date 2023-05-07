import { cloneDeep } from "lodash";

export const MaaserActions = {
  ADD_INCOME: "ADD_INCOME",
  ADD_MAASER: "ADD_MAASER",
  ADD_DONATION_AMOUNT: "ADD_DONATION_AMOUNT",
  SUBTRACT_MAASER: "SUBTRACT_MAASER",
};

export const maaserReducer = (state, action) => {
  switch (action.type) {
    case MaaserActions.ADD_INCOME: {
    }
    case MaaserActions.ADD_MAASER: {
      const newMaaser = state.maaser + action.amount * 0.1;
      return { ...state, maaser: newMaaser };
    }
    case MaaserActions.ADD_DONATION_AMOUNT: {
      // state.amount
      // action.amount
      const now = new Date();
      const thisYear = now.getFullYear();
      const thisMonth = now.getMonth();
      if (
        state.monthDonations.year != thisYear ||
        state.monthDonations.month != thisMonth
      ) {
        // state.monthDonations;
      }
    }
    case MaaserActions.SUBTRACT_MAASER: {
      const newMaaser = state.maaser - action.amount;
      return { ...state, maaser: newMaaser };
    }
  }
};
