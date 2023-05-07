import React, { useState, useContext } from "react";
import { CharitiesContext } from "./state/charities/charities-context";

export function Test() {
  const { charitiesState, charitiesDispatch } = useContext(CharitiesContext);

  return (
    <div className="App">
      <h1>Title</h1>
      <div>
        {charitiesState.charities &&
          charitiesState.charities.map((charity) => (
            <p>
              Name: {charity.name} Amount: {charity.amount}
            </p>
          ))}
      </div>
    </div>
  );
}
