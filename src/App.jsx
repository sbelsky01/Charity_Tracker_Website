import "./App.css";
import React, { useReducer } from "react";
import { Header } from "./components/header/header";
import { HashRouter, Routes, Route } from "react-router-dom";
import { CharitiesContext } from "./state/charities/charities-context";
import { charitiesReducer } from "./state/charities/charities-reducer";
import { MaaserContext } from "./state/maaser/maaser-context";
import { maaserReducer } from "./state/maaser/maaser-reducer";
import { Test } from "./Test";
import Home from "./components/home/home";
import MyCharities from "./components/charities/my-charities";
import Maaser from "./components/Maaser/maaser";

function App() {
  const [charitiesState, charitiesDispatch] = useReducer(charitiesReducer, {
    charities: [
      { name: "Tomche Shabbos of Rockland County", amount: 80 },
      { name: "Oorah", amount: 29 },
      { name: "Chai Lifeline", amount: 80 },
      { name: "Kupath Ezra", amount: 80 },
    ],
    charities: [],
  });
  const [maaserState, maaserDispatch] = useReducer(maaserReducer, {
    income: [
      {
        year: 2023,
        list: [
          { description: "Paycheck", amt: 800, date: "Mar. 23" },
          { description: "Paycheck", amt: 800, date: "Apr. 23" },
          { description: "Paycheck", amt: 800, date: "May. 23" },
        ],
      },
      {
        year: 2022,
        list: [
          { description: "Paycheck", amt: 800, date: "Mar. 23" },
          { description: "Bonus", amt: 300, date: "Apr. 6" },
          { description: "Paycheck", amt: 800, date: "May. 23" },
        ],
      },
      {
        year: 2021,
        list: [
          { description: "Paycheck", amt: 800, date: "Mar. 23" },
          { description: "Bonus", amt: 300, date: "Sept. 6" },
          { description: "Paycheck", amt: 800, date: "May. 23" },
        ],
      },
    ],
    monthDonations: { year: null, month: null, amount: 0 },
    yearDonations: { year: null, amount: 0 },
    maaser: 0,
  });

  return (
    <HashRouter>
      <Header />

      <CharitiesContext.Provider value={{ charitiesState, charitiesDispatch }}>
        <MaaserContext.Provider value={{ maaserState, maaserDispatch }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/my-charities" element={<MyCharities />} />
            <Route path="/Maaser" element={<Maaser />} />
          </Routes>
        </MaaserContext.Provider>
      </CharitiesContext.Provider>
    </HashRouter>
  );
}

export default App;
