import React, { useState, useContext, useEffect } from "react";
import "./maaser.css";
import { Button, Typography, Box, Paper } from "@mui/material";
import { MaaserContext } from "../../state/maaser/maaser-context";
import { months } from "../months.jsx";
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
        <div>
          <div style={{ marginRight: "50px" }}>
            <Typography variant="h3">
              {months[maaserState.monthDonations.month]}{" "}
              {maaserState.yearDonations.year}
            </Typography>
          </div>
          <div>
            <Box>
              <Typography variant="body1" fontSize="1.2em">
                Donated this year:{" "}
                <span style={{ fontWeight: "bold", fontSize: "1.1em" }}>
                  ${maaserState.yearDonations.amount.toFixed(2)}
                </span>
              </Typography>
              <Typography variant="body1" fontSize="1.2em">
                Donated this month:{" "}
                <span style={{ fontWeight: "bold", fontSize: "1.1em" }}>
                  ${maaserState.monthDonations.amount.toFixed(2)}
                </span>
              </Typography>
            </Box>
          </div>
        </div>
        <Typography
          variant="h2"
          sx={{ textAlign: "center", margin: "70px auto" }}
          className="maaser-total"
        >
          {maaserState.maaser > 0
            ? "Maaser: $" + maaserState.maaser.toFixed(2)
            : "No maaser at this time"}
        </Typography>
        <AddIncomeDialog open={open} handleClose={handleClose} />
        {maaserState.income.length >= 1 ? (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "20px",
              }}
            >
              <Typography variant="h4">Income</Typography>
              <Button onClick={handleClickOpen} variant="outlined">
                Add Income
              </Button>
            </div>
            <IncomeAccordion income={maaserState.income} />
          </>
        ) : (
          <>
            <Typography
              variant="body1"
              sx={{ textAlign: "center", marginBottom: "20px" }}
              fontSize="1.1em"
            >
              Welcome to the Income Tracker! Start tracking your income and
              managing your Maaser with ease. To get started, click the button
              below to add your first income entry.
            </Typography>
            <Button
              onClick={handleClickOpen}
              variant="outlined"
              sx={{ display: "block", margin: "0 auto" }}
            >
              Add Income
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
