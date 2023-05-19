import { createContext } from "react";

export const searchTypes = {
  KEYWORD: "KEYWORD",
  CAUSE: "CAUSE",
};

export const SearchContext = createContext({
  keywordInput: "",
  causeInput: "",
  numSearchResults: 10,
  searchType: null,
  results: null,
});
