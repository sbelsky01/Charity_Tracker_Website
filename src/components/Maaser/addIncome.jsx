import React, { useContext, useState } from "react";
import { MaaserContext } from "../../state/maaser/maaser-context";
import { MaaserActions } from "../../state/maaser/maaser-reducer";
import {
  Dialog,
  Button,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  TextField,
  Box,
  Typography,
  InputAdornment,
} from "@mui/material";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";

export function AddIncomeDialog(props) {
  const { maaserState, maaserDispatch } = useContext(MaaserContext);
  const open = props.open;

  const [description, setDescription] = useState("");
  const [incomeAmt, setIncomeAmt] = useState("");
  const [dateEarned, setDateEarned] = useState("");
  const [noDescriptionErr, setNoDescriptionErr] = useState(false);
  const [noAmountErr, setNoAmountErr] = useState(false);
  const [invalidAmountErr, setInvalidAmountErr] = useState(false);
  const [noDateErr, setNoDateErr] = useState(false);
  const [invalidDateErr, setInvalidDateErr] = useState(false);

  function handleIncomeAmtChange(event) {
    const amount = event.target.value;
    if (amount === "" || /^\d+(\.\d{0,2})?$/.test(amount)) {
      setIncomeAmt(amount);
    }
  }

  function handleDescriptionChange(event) {
    setDescription(event.target.value);
  }

  function handleDateChange(event) {
    setDateEarned(event.target.value);
  }

  function handleClose(submit) {
    var error = false;
    cancelErrors();
    if (submit) {
      if (description == "") {
        setNoDescriptionErr(true);
        error = true;
      }
      if (incomeAmt == "") {
        setNoAmountErr(true);
        error = true;
      }
      if (parseInt(incomeAmt) <= 0) {
        setInvalidAmountErr(true);
        error = true;
      }
      if (dateEarned == "") {
        setNoDateErr(true);
        error = true;
      }
      const now = new Date();
      const date = new Date(dateEarned);
      if (date > now) {
        setInvalidDateErr(true);
        error = true;
      }
      if (!error) {
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

        setDescription("");
        setIncomeAmt("");
        setDateEarned("");
        props.handleClose();
      }
    } else {
      setDescription("");
      setIncomeAmt("");
      setDateEarned("");
      props.handleClose();
    }
  }

  function cancelErrors() {
    setNoDescriptionErr(false);
    setNoAmountErr(false);
    setInvalidAmountErr(false);
    setNoDateErr(false);
    setInvalidDateErr(false);
  }

  return (
    <Dialog open={open} onClose={() => handleClose(false)}>
      <Box sx={{ width: "30vw" }}>
        <DialogTitle>Add Income</DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column" }}
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
            <Box sx={{ height: "30px" }}>
              {noDescriptionErr && (
                <Typography variant="p" sx={{ color: "red", maxWidth: "100%" }}>
                  Please enter a description.
                </Typography>
              )}
            </Box>
          </FormControl>
          <FormControl>
            <TextField
              autoFocus
              fullWidth
              variant="outlined"
              placeholder="amount"
              value={incomeAmt}
              onChange={handleIncomeAmtChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AttachMoneyIcon />
                  </InputAdornment>
                ),
              }}
            />
            <Box sx={{ height: "30px" }}>
              {noAmountErr && (
                <Typography variant="p" sx={{ color: "red", maxWidth: "100%" }}>
                  Please enter an amount.
                </Typography>
              )}
              {invalidAmountErr && (
                <Typography variant="p" sx={{ color: "red", maxWidth: "100%" }}>
                  Please enter a valid amount.
                </Typography>
              )}
            </Box>
          </FormControl>
          <FormControl>
            <TextField
              type="date"
              value={dateEarned}
              onChange={handleDateChange}
            />
            <Box sx={{ height: "30px" }}>
              {noDateErr && (
                <Typography variant="p" sx={{ color: "red", maxWidth: "100%" }}>
                  Please enter a date.
                </Typography>
              )}
              {invalidDateErr && (
                <Typography variant="p" sx={{ color: "red", maxWidth: "100%" }}>
                  Please enter a valid date.
                </Typography>
              )}
            </Box>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleClose(true)}>Add</Button>
          <Button onClick={() => handleClose(false)}>Cancel</Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
