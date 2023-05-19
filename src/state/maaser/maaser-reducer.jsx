import { cloneDeep } from "lodash";

export const MaaserActions = {
  ADD_INCOME: "ADD_INCOME",
  ADD_MAASER: "ADD_MAASER",
  ADD_DONATION_AMOUNT: "ADD_DONATION_AMOUNT",
  SUBTRACT_MAASER: "SUBTRACT_MAASER",
  UPDATE_DONATION_COUNT: "UPDATE_DONATION_COUNT",
};

export const maaserReducer = (state, action) => {
  function updateDonationCount() {
    const now = new Date(2023, 5, 17);
    const thisYear = now.getFullYear();
    const thisMonth = now.getMonth();
    if (
      state.monthDonations.year != thisYear ||
      state.monthDonations.month != thisMonth
    ) {
      state.monthDonations.year = thisYear;
      state.monthDonations.month = thisMonth;
      state.monthDonations.amount = 0;
    }
    if (state.yearDonations.year != thisYear) {
      state.yearDonations.year = thisYear;
      state.yearDonations.amount = 0;
    }

    return { ...state };
  }

  switch (action.type) {
    case MaaserActions.ADD_INCOME: {
      let incomeYearList = cloneDeep(state.income);
      const newListItem = {
        description: action.description,
        amt: action.amount,
        date: action.date,
      };
      const now = new Date();
      const thisYear = now.getFullYear();
      let thisYearIncome = incomeYearList.find((x) => x.year == thisYear);
      if (!thisYearIncome) {
        const newIncomeYear = { year: thisYear, list: [] };
        incomeYearList = [newIncomeYear, ...incomeYearList];
        thisYearIncome = newIncomeYear;
      }
      thisYearIncome.list = [...thisYearIncome.list, newListItem];
      return { ...state, income: incomeYearList };
    }

    case MaaserActions.ADD_MAASER: {
      const newMaaser = state.maaser + action.amount * 0.1;
      return { ...state, maaser: newMaaser };
    }

    case MaaserActions.ADD_DONATION_AMOUNT: {
      const newAmt = action.amount;
      state = updateDonationCount();
      const newMonthAmt = state.monthDonations.amount + parseFloat(newAmt);
      const newYearAmt = state.yearDonations.amount + parseFloat(newAmt);

      return {
        ...state,
        monthDonations: { ...state.monthDonations, amount: newMonthAmt },
        yearDonations: { ...state.yearDonations, amount: newYearAmt },
      };
    }

    case MaaserActions.SUBTRACT_MAASER: {
      const newMaaser = state.maaser - action.amount;
      return { ...state, maaser: newMaaser };
    }

    case MaaserActions.UPDATE_DONATION_COUNT: {
      state = updateDonationCount();
      return { ...state };
    }
  }
};
