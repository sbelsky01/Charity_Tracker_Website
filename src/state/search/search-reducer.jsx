export const SearchActions = {
  SET_KEYWORD_INPUT: "SET_KEYWORD_INPUT",
  SET_CAUSE_INPUT: "SET_CAUSE_INPUT",
  SET_NUM_SEARCH_RESULTS: "SET_NUM_SEARCH_RESULTS",
  SET_SEARCH_TYPE: "SET_SEARCH_TYPE",
};

export const searchReducer = (state, action) => {
  switch (action.type) {
    case SearchActions.SET_KEYWORD_INPUT: {
      return { ...state, keywordInput: action.value };
    }

    case SearchActions.SET_CAUSE_INPUT: {
      return { ...state, causeInput: action.value };
    }

    case SearchActions.SET_NUM_SEARCH_RESULTS: {
      return { ...state, numSearchResults: action.value };
    }

    case SearchActions.SET_SEARCH_TYPE: {
      return { ...state, searchType: action.value };
    }
  }
};
