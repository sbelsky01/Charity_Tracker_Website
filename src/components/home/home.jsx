import React, { useState, useContext, useEffect } from "react";
import "./home.css";
import {
  Typography,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  TextField,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Link,
  Button,
  Box,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { CharitiesContext } from "../../state/charities/charities-context";
import { DonationActions } from "../../state/charities/charities-reducer";
import { causes } from "./causes";
import DefaultIcon from "../../images/default-charity-logo-transparent-edges.png";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";

const numResultsChoices = [10, 20, 30, 40, 50];
export const searchTypes = {
  KEYWORD: "KEYWORD",
  CAUSE: "CAUSE",
};

export default function Home() {
  const [keywordInput, setKeywordInput] = useState("");
  const [causeInput, setCauseInput] = useState("");
  const [results, setResults] = useState([]);
  const [donationAmt, setDonationAmt] = useState("");
  const [numSearchResults, setNumSearchResults] = useState(10);
  const [searchType, setSearchType] = useState("");
  const [selectedCharity, setSelectedCharity] = useState({ name: "Every.org" });
  const [open, setOpen] = useState(false);

  const { charitiesState, charitiesDispatch } = useContext(CharitiesContext);

  function handleKeywordInputChange(event) {
    setKeywordInput(event.target.value);
  }

  function handleKeywordInputSubmit() {
    setSearchType(searchTypes.KEYWORD);
    searchByKeyword();
  }

  function handleCauseSelected(cause) {
    console.log(cause);
    setSearchType(searchTypes.CAUSE);
    setCauseInput(cause);
    searchByCause(cause);
  }

  function handleClickOpen(charity) {
    setSelectedCharity(charity);
    setOpen(true);
  }

  function handleClose(donate) {
    if (donate) {
      processDonation();
    }
    setOpen(false);
    setDonationAmt("");
  }

  function handleDonationAmtChange(event) {
    const amount = event.target.value;
    if (amount === "" || /^\d+(\.\d{0,2})?$/.test(amount)) {
      setDonationAmt(amount);
    }
  }

  useEffect(() => {
    switch (searchType) {
      case searchTypes.KEYWORD: {
        searchByKeyword(keywordInput);
        break;
      }
      case searchTypes.CAUSE: {
        searchByCause(causeInput);
        break;
      }
    }
  }, [numSearchResults]);

  function processDonation() {
    if (!charitiesState.charities.find((x) => x.ein === selectedCharity.ein)) {
      charitiesDispatch({
        type: DonationActions.NEW_CHARITY,
        charity: selectedCharity,
      });
    }

    charitiesDispatch({
      type: DonationActions.DONATE,
      charity: selectedCharity,
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
    console.log(selectedCause);
    fetch(
      `https://partners.every.org/v0.2/browse/${selectedCause}
      ?apiKey=pk_live_7ff644bd22f350332599315a92d916e7&take=${numSearchResults}`
    )
      .then((response) => response.json())
      .then((data) => {
        setResults(data.nonprofits);
        console.log(`https://partners.every.org/v0.2/browse/${selectedCause}
      ?apiKey=pk_live_7ff644bd22f350332599315a92d916e7&take=${numSearchResults}`);
      });
  }

  function checkForKeywordEnter(event) {
    if (event.keyCode == 13) {
      event.target.blur();
      handleKeywordInputSubmit();
    }
  }

  return (
    <div className="App">
      <div className="charity-search" style={{ display: "flex" }}>
        <div
          className="search-bar"
          style={{ display: "flex", flexDirection: "column" }}
        >
          <TextField
            variant="standard"
            label="Search by Keyword"
            value={keywordInput}
            onChange={handleKeywordInputChange}
            onKeyDown={checkForKeywordEnter}
          />
          <FormControl variant="standard" sx={{ minWidth: "150px" }}>
            <InputLabel id="cause-select-label">Select Cause</InputLabel>
            <Select labelId="cause-select-label" defaultValue="">
              {causes.map((cause) => (
                <MenuItem
                  key={cause.value}
                  value={cause.value}
                  onClick={() => handleCauseSelected(cause.value)}
                >
                  {cause.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
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
            borderLeft: "thin black solid",
            minHeight: "300px",
            minWidth: "300px",
          }}
        >
          <Dialog open={open} onClose={() => handleClose(false)}>
            <DialogTitle>Donate to {selectedCharity.name}</DialogTitle>
            <DialogContent>
              <DialogContentText>Enter amount:</DialogContentText>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <AttachMoneyIcon />
                <TextField
                  autoFocus
                  margin="dense"
                  fullWidth
                  variant="standard"
                  placeholder="xxx.xx"
                  value={donationAmt}
                  onChange={handleDonationAmtChange}
                />
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => handleClose(true)}>Donate</Button>
              <Button onClick={() => handleClose(false)}>Cancel</Button>
            </DialogActions>
          </Dialog>
          <List>
            <ListItem
              sx={
                results.length === 0
                  ? { display: "relative" }
                  : { display: "none" }
              }
            >
              <ListItemText>No Results</ListItemText>
            </ListItem>
            {/* <ListItem>
              <ListItemText>No Results</ListItemText>
            </ListItem> */}
            {results.map((charity) => (
              <ListItem
                className="profile"
                key={charity.ein}
                alignItems="flex-start"
                divider
                secondaryAction={
                  <IconButton
                    edge="end"
                    onClick={() => handleClickOpen(charity)}
                  >
                    <VolunteerActivismIcon />
                  </IconButton>
                }
              >
                <ListItemAvatar>
                  <Avatar
                    alt={charity.name + "logo"}
                    src={charity.logoUrl || DefaultIcon}
                  />
                </ListItemAvatar>
                <Box sx={{ width: "100%" }}>
                  <ListItemText
                    primary={charity.name}
                    secondary={
                      charity.description ? charity.description + "..." : ""
                    }
                  />
                  {/* <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "end",
                    }}
                  > */}
                  <Link
                    href={charity.profileUrl}
                    variant="body2"
                    target="_blank"
                    color="#36723a"
                  >
                    Learn More about {charity.name}
                  </Link>
                </Box>
              </ListItem>
            ))}
          </List>
        </div>
      </div>
    </div>
  );
}
