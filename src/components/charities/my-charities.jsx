import React, { useContext } from "react";
import { CharitiesContext } from "../../state/charities/charities-context";
import DefaultCoverImage from "../../images/charity-and-donation-icons-vector-merged-layers-gradient.jpg";

export default function MyCharities() {
  const { charitiesState, charitiesDispatch } = useContext(CharitiesContext);

  return (
    <div className="App">
      <div className="content">
        <h1>My Charities</h1>
        {charitiesState.charities.map((charity) => (
          <div style={{ border: "thin solid black" }} key={charity.ein}>
            <img
              src={charity.coverImageUrl || DefaultCoverImage}
              style={
                charity.coverImageUrl
                  ? {
                      height: "150px",
                      width: "100vw",
                      objectFit: "cover",
                    }
                  : {
                      height: "150px",
                      width: "100vw",
                      objectFit: "cover",
                      objectPosition: "top",
                    }
              }
            />
            <div style={{ display: "flex" }}>
              <img src={charity.logoUrl} />
              {charity.name}
            </div>
            <div>{charity.description}</div>
            <div>
              {charity.donations.map((donation) => (
                <p>
                  {donation.date} {donation.amount}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
