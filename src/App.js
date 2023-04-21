import "./App.css";
import React, { useReducer } from "react";
import { Header } from "./components/header/header";
import { HashRouter, Routes, Route } from "react-router-dom";
import { CharitiesContext } from "./state/charities/charities-context";
import { charitiesReducer } from "./state/charities/charities-reducer";
import Home from "./components/home/home";
import MyCharities from "./components/charities/my-charities";
import Maaser from "./components/Maaser/maaser";

function App() {
  const [charitiesState, charitiesDispatch] = useReducer(charitiesReducer, {
    myCharities: [],
    income: [],
    maaser: 0,
  });

  return (
    <HashRouter>
      <Header />
      <CharitiesContext.Provider value={{ charitiesState, charitiesDispatch }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/my-charities" element={<MyCharities />} />
          <Route path="/Maaser" element={<Maaser />} />
        </Routes>
      </CharitiesContext.Provider>
    </HashRouter>
  );
}

export default App;
