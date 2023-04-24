import React, { useState, useContext } from "react";
import {
  Typography,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import { CharitiesContext } from "../../state/charities/charities-context";
import { DonationActions } from "../../state/charities/charities-reducer";
import { causes } from "./causes";

const numResultsChoices = [10, 20, 30, 40, 50];

export default function Home() {
  const [keywordInput, setKeywordInput] = useState("");
  const [results, setResults] = useState([]);
  const [donationAmt, setDonationAmt] = useState("");
  const [numSearchResults, setNumSearchResults] = useState(10);

  const { charitiesState, charitiesDispatch } = useContext(CharitiesContext);

  function handleInputChange(event) {
    setKeywordInput(event.target.value);
  }

  function handleInputSubmit() {
    searchByKeyword();
  }

  function handleDonationAmtChange(event) {
    setDonationAmt(event.target.value);
  }

  function handleDonateSubmit(charity) {
    if (!charitiesState.charities.find((x) => x.ein === charity.ein)) {
      charitiesDispatch({
        type: DonationActions.NEW_CHARITY,
        charity: charity,
      });
    }

    charitiesDispatch({
      type: DonationActions.DONATE,
      charity: charity,
      amount: donationAmt,
    });
  }

  function searchByKeyword() {
    fetch(
      `https://partners.every.org/v0.2/search/${keywordInput}
      ?apiKey=pk_live_7ff644bd22f350332599315a92d916e7&take=${numSearchResults}`
    )
      .then((response) => response.json())
      .then((data) => {
        setResults(data.nonprofits);
      });
  }

  function searchByCause(selectedCause) {
    fetch(
      `https://partners.every.org/v0.2/browse/${selectedCause}
      ?apiKey=pk_live_7ff644bd22f350332599315a92d916e7&take=${numSearchResults}`
    )
      .then((response) => response.json())
      .then((data) => {
        setResults(data.nonprofits);
      });
  }

  return (
    <div className="App">
      <Typography variant="h1">Welcome</Typography>
      <div className="charity-search" style={{ display: "flex" }}>
        <div className="search-bar">
          <h3 htmlFor="keyword-search-box">Search By keyword</h3>
          <input
            type="text"
            id="keyword-search-box"
            value={keywordInput}
            onChange={handleInputChange}
          />
          <button onClick={handleInputSubmit}>Search</button>
          <br />
          <FormControl variant="standard" sx={{ minWidth: "150px" }}>
            <InputLabel id="cause-select-label">Select Cause</InputLabel>
            <Select labelId="cause-select-label" defaultValue="">
              {causes.map((cause) => (
                <MenuItem
                  key={cause.value}
                  value={cause.value}
                  onClick={() => searchByCause(cause.value)}
                >
                  {cause.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <br />

          <FormControl variant="standard" sx={{ minWidth: "150px" }}>
            <InputLabel id="num-results-select-label">
              Number of results
            </InputLabel>
            <Select labelId="num-results-select-label" defaultValue={10}>
              {numResultsChoices.map((number) => (
                <MenuItem
                  key={number}
                  value={number}
                  onClick={() => setNumSearchResults(number)}
                >
                  {number}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div
          className="results"
          style={{
            border: "thin black solid",
            minHeight: "300px",
            minWidth: "300px",
          }}
        >
          <input
            type="text"
            value={donationAmt}
            onChange={handleDonationAmtChange}
            placeholder="enter donation amount"
          />
          <hr />
          {results.map((charity) => (
            <div className="profile" key={charity.ein}>
              <div style={{ display: "flex" }}>
                <img src={charity.logoUrl} />
                <h3>{charity.name}</h3>
              </div>
              <div>
                <p>{charity.description}...</p>
              </div>
              <p>
                <a href={charity.profileUrl} target="_blank">
                  Learn More about {charity.name}
                </a>
              </p>
              <button onClick={() => handleDonateSubmit(charity)}>
                Donate
              </button>
              <hr />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
