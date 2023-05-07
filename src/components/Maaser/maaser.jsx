import React, { useState, useContext } from "react";
import "./maaser.css";
import {
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  Box,
  Divider,
} from "@mui/material";
import { MaaserContext } from "../../state/maaser/maaser-context";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function Maaser() {
  const { maaserState, maaserDispatch } = useContext(MaaserContext);

  return (
    <div className="App">
      <h1>Total Donated</h1>
      <h3>
        <span>This year: ${maaserState.yearDonations.amount}</span> This month:
        ${maaserState.monthDonations.amount}
      </h3>
      <Typography variant="h1" sx={{ textAlign: "center" }}>
        Maaser: ${maaserState.maaser}
      </Typography>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h4">Income</Typography>
        <Button>Add Income</Button>
      </div>
      {maaserState.income &&
        maaserState.income.map((group) => (
          <Accordion defaultExpanded={group.year == "2023"}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{ backgroundColor: "lightgrey" }}
            >
              <Typography> {group.year}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {group.list.map((incomeLine) => (
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Box>
                    <Typography variant="h6">
                      {incomeLine.description}
                    </Typography>
                    <Typography>{incomeLine.date}</Typography>
                  </Box>
                  <Typography> ${incomeLine.amt}</Typography>
                  <Divider />
                </Box>
              ))}
            </AccordionDetails>
          </Accordion>
        ))}
    </div>
  );
}
