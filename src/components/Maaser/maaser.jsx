import React, { useState, useContext, useEffect } from "react";
import "./maaser.css";
import {
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  Box,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  FormControl,
} from "@mui/material";
import { MaaserContext } from "../../state/maaser/maaser-context";
import { months } from "./months.jsx";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { MaaserActions } from "../../state/maaser/maaser-reducer";

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

function AddIncomeDialog(props) {
  const { maaserState, maaserDispatch } = useContext(MaaserContext);
  const open = props.open;

  const [description, setDescription] = useState("");
  const [incomeAmt, setIncomeAmt] = useState();
  const [dateEarned, setDateEarned] = useState(null);

  function handleIncomeAmtChange(event) {
    setIncomeAmt(event.target.value);
  }

  function handleDescriptionChange(event) {
    setDescription(event.target.value);
  }

  function handleDateChange(event) {
    setDateEarned(event.target.value);
  }

  function handleClose(submit) {
    if (submit) {
      maaserDispatch({
        type: MaaserActions.ADD_INCOME,
        description: description,
        amount: incomeAmt,
        date: dateEarned,
      });

      maaserDispatch({
        type: MaaserActions.ADD_MAASER,
        amount: incomeAmt,
      });
    }
    setDescription("");
    setIncomeAmt(null);
    setDateEarned(null);
    props.handleClose();
  }

  return (
    <Dialog open={open} onClose={() => handleClose(false)}>
      <DialogTitle>Add Income</DialogTitle>
      <DialogContent
        sx={{ display: "flex", flexDirection: "column", alignItems: "end" }}
        className="income-form"
      >
        <FormControl>
          <TextField
            multiline
            fullWidth
            rows={2}
            variant="outlined"
            placeholder="description"
            value={description}
            onChange={handleDescriptionChange}
          />
        </FormControl>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <AttachMoneyIcon />
          <FormControl>
            <TextField
              autoFocus
              fullWidth
              variant="outlined"
              placeholder="Amount"
              value={incomeAmt}
              onChange={handleIncomeAmtChange}
            />
          </FormControl>
        </Box>
        <FormControl>
          <TextField value={dateEarned} onChange={handleDateChange} />
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleClose(true)}>Add</Button>
        <Button onClick={() => handleClose(false)}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
}

function IncomeAccordion(props) {
  const income = props.income;
  return (
    <>
      {income &&
        income.map((group) => (
          <Accordion defaultExpanded={group.year == "2023"} key={group.year}>
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
    </>
  );
}
