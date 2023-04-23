import { cloneDeep } from "lodash";

export const DonationActions = {
  NEW_CHARITY: "NEW_CHARITY",
  DONATE: "DONATE",
};

export const charitiesReducer = (state, action) => {
  switch (action.type) {
    case DonationActions.NEW_CHARITY: {
      const newCharity = {
        ...action.charity,
        donations: [],
      };
      return { charities: [...state.charities, newCharity] };
    }
    case DonationActions.DONATE: {
      let newCharities = cloneDeep(state.charities);
      const updatedCharity = newCharities.find(
        (x) => x.ein === action.charity.ein
      );
      updatedCharity.donations = [
        ...updatedCharity.donations,
        { date: "4/21/2023", amount: action.amount },
      ];
      return {
        charities: newCharities,
      };
    }
  }
};
