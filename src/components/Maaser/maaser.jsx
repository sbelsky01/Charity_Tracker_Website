import React, { useState, useContext, useEffect } from "react";
import "./maaser.css";
import { Button, Typography, Box, Divider } from "@mui/material";
import { MaaserContext } from "../../state/maaser/maaser-context";
import { months } from "./months.jsx";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { MaaserActions } from "../../state/maaser/maaser-reducer";
import { AddIncomeDialog } from "./addIncome";

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
      <h1>Total Donated</h1>
      <h3>
        Total Donated in {maaserState.yearDonations.year}: $
        {maaserState.yearDonations.amount.toFixed(2)}
        <br />
        Total Donated in {months[maaserState.monthDonations.month]}: $
        {maaserState.monthDonations.amount.toFixed(2)}
      </h3>
      {maaserState.maaser > 0 ? (
        <Typography variant="h1" sx={{ textAlign: "center" }}>
          Maaser: ${maaserState.maaser.toFixed(2)}
        </Typography>
      ) : (
        <Typography variant="h3" sx={{ textAlign: "center" }}>
          No maaser at this time
        </Typography>
      )}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h4">Income</Typography>
        <Button onClick={handleClickOpen}>Add Income</Button>
      </div>
      <AddIncomeDialog open={open} handleClose={handleClose} />
      <IncomeAccordion income={maaserState.income} />
    </div>
  );
}

function IncomeAccordion(props) {
  const income = props.income;
  const [expandedPanel, setExpandedPanel] = useState("");

  function handleToggle(year) {
    year == expandedPanel ? setExpandedPanel("") : setExpandedPanel(year);
  }

  function getFormattedDate(dateString) {
    const dateObj = new Date(dateString);
    return months[dateObj.getMonth()] + " " + dateObj.getDate();
  }
  return (
    <>
      {income &&
        income.map((group) => (
          <Accordion
            key={group.year}
            expanded={expandedPanel == group.year}
            onChange={() => handleToggle(group.year)}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{ backgroundColor: "lightgrey" }}
            >
              <Typography> {group.year}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {group.list.map((incomeLine, index) => (
                <div style={{ margin: "8px 25px" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-end",
                      paddingRight: "4px",
                    }}
                  >
                    <div>
                      <Typography variant="h6">
                        {incomeLine.description}
                      </Typography>
                      <Typography>
                        {getFormattedDate(incomeLine.date)}
                      </Typography>
                    </div>
                    <div>
                      <Typography variant="h6">
                        ${parseFloat(incomeLine.amt).toFixed(2)}
                      </Typography>
                    </div>
                  </div>
                  <Divider />
                </div>
              ))}
            </AccordionDetails>
          </Accordion>
        ))}
    </>
  );
}
