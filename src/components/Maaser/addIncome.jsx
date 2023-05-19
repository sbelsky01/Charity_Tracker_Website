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
} from "@mui/material";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";

export function AddIncomeDialog(props) {
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
          <TextField
            type="date"
            value={dateEarned}
            onChange={handleDateChange}
          />
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleClose(true)}>Add</Button>
        <Button onClick={() => handleClose(false)}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
}
