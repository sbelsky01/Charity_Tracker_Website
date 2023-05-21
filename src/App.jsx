import "./App.css";
import React, { useReducer } from "react";
import { Header } from "./components/header/header";
import { HashRouter, Routes, Route } from "react-router-dom";
import { CharitiesContext } from "./state/charities/charities-context";
import { charitiesReducer } from "./state/charities/charities-reducer";
import { MaaserContext } from "./state/maaser/maaser-context";
import { maaserReducer } from "./state/maaser/maaser-reducer";
import { SearchContext } from "./state/search/search-context";
import { searchReducer } from "./state/search/search-reducer";
import Home from "./components/home/home";
import MyCharities from "./components/charities/my-charities";
import Maaser from "./components/Maaser/maaser";

function App() {
  const [charitiesState, charitiesDispatch] = useReducer(charitiesReducer, {
    charities: [],
  });
  const [maaserState, maaserDispatch] = useReducer(maaserReducer, {
    income: [
      {
        year: 2023,
        list: [
          { description: "Paycheck", amt: 800, date: "2023-02-23" },
          { description: "Paycheck", amt: 800, date: "2023-04-23" },
          { description: "Paycheck", amt: 800, date: "2023-05-23" },
        ],
      },
      {
        year: 2022,
        list: [
          { description: "Paycheck", amt: 800, date: "2022-03-23" },
          { description: "Bonus", amt: 300, date: "2022-04-06" },
          { description: "Paycheck", amt: 800, date: "2022-05-23" },
        ],
      },
      {
        year: 2021,
        list: [
          { description: "Paycheck", amt: 800, date: "2021-03-23" },
          { description: "Bonus", amt: 300, date: "2021-09-06" },
          { description: "Paycheck", amt: 800, date: "2021-05-23" },
        ],
      },
    ],
    monthDonations: { year: null, month: null, amount: 0 },
    yearDonations: { year: null, amount: 0 },
    maaser: 0,
  });
  const [searchState, searchDispatch] = useReducer(searchReducer, {
    keywordInput: "",
    causeInput: "",
    numSearchResults: 10,
    searchType: null,
    results: null,
  });

  return (
    <HashRouter>
      {/* <div className="root"> */}
      <Header />
      <CharitiesContext.Provider value={{ charitiesState, charitiesDispatch }}>
        <MaaserContext.Provider value={{ maaserState, maaserDispatch }}>
          <SearchContext.Provider value={{ searchState, searchDispatch }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/my-charities" element={<MyCharities />} />
              <Route path="/Maaser" element={<Maaser />} />
            </Routes>
          </SearchContext.Provider>
        </MaaserContext.Provider>
      </CharitiesContext.Provider>
      {/* </div> */}
    </HashRouter>
  );
}

export default App;
