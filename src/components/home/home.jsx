import React, { useState } from "react";
import { Typography } from "@mui/material";

export default function Home() {
  const [keywordInput, setKeywordInput] = useState("");
  const [results, setResults] = useState([]);
  const [donationAmt, setDonationAmt] = useState(null);

  function handleInputChange(event) {
    setKeywordInput(event.target.value);
  }

  function handleInputSubmit() {
    searchCharities();
  }

  function handleDonationAmtChange(event) {
    setDonationAmt(event.target.value);
  }

  function handleDonateSubmit(ein) {}

  function searchCharities() {
    fetch(
      `https://partners.every.org/v0.2/search/${keywordInput}?apiKey=pk_live_7ff644bd22f350332599315a92d916e7`
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("results:");
        console.log(keywordInput);
        console.log(data.nonprofits);
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
        </div>
        <div
          className="results"
          style={{
            border: "thin black solid",
            minHeight: "300px",
            minWidth: "300px",
          }}
        >
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
              <button>Donate</button>
              <hr />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
