import React, { useState, useContext, useEffect } from "react";
import "./maaser.css";
import { Button, Typography, Box, Paper } from "@mui/material";
import { MaaserContext } from "../../state/maaser/maaser-context";
import { months } from "./months.jsx";
import { MaaserActions } from "../../state/maaser/maaser-reducer";
import { AddIncomeDialog } from "./addIncome";
import { IncomeAccordion } from "./incomeAccordion";

export default function Maaser() {
  const [open, setOpen] = useState(false);

  const { maaserState, maaserDispatch } = useContext(MaaserContext);

  useEffect(() => {
    maaserDispatch({
      type: MaaserActions.UPDATE_DONATION_COUNT,
    });
  }, []);

  function handleClickOpen() {
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
  }

  return (
    <div className="App">
      <div className="content">
        <div
          style={{
            display: "flex",
          }}
        >
          <div style={{ marginRight: "50px" }}>
            <Typography variant="h3">
              {months[maaserState.monthDonations.month]}{" "}
              {maaserState.yearDonations.year}
            </Typography>
          </div>
          <div>
            <Box>
              <Typography variant="body1" fontSize="1.2em">
                Total donated this year: $
                {maaserState.yearDonations.amount.toFixed(2)}
              </Typography>
              <Typography variant="body1" fontSize="1.2em">
                Total donated this month: $
                {maaserState.monthDonations.amount.toFixed(2)}
              </Typography>
            </Box>
          </div>
        </div>
        {maaserState.maaser > 0 ? (
          <Typography
            variant="h2"
            sx={{ textAlign: "center", margin: "50px auto" }}
            className="maaser-total"
          >
            Maaser: ${maaserState.maaser.toFixed(2)}
          </Typography>
        ) : (
          <Typography variant="h3" sx={{ textAlign: "center" }}>
            No maaser at this time
          </Typography>
        )}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            // marginTop: "70px",
          }}
        >
          <Typography variant="h4">Income</Typography>
          <Button onClick={handleClickOpen}>Add Income</Button>
        </div>
        <AddIncomeDialog open={open} handleClose={handleClose} />
        <IncomeAccordion income={maaserState.income} />
      </div>
    </div>
  );
}
