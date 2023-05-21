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
        totalDonations: 0,
      };
      return { ...state, charities: [...state.charities, newCharity] };
    }
    case DonationActions.DONATE: {
      let newCharities = cloneDeep(state.charities);
      const now = new Date();
      const updatedCharity = newCharities.find(
        (x) => x.ein === action.charity.ein
      );
      updatedCharity.donations = [
        { date: now.toDateString(), amount: action.amount },
        ...updatedCharity.donations,
      ];
      updatedCharity.totalDonations =
        updatedCharity.totalDonations + parseFloat(action.amount);
      return {
        charities: newCharities,
      };
    }
  }
};
