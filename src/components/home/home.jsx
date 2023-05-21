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
  Skeleton,
} from "@mui/material";
import { CharitiesContext } from "../../state/charities/charities-context";
import { MaaserContext } from "../../state/maaser/maaser-context";
import { SearchContext, searchTypes } from "../../state/search/search-context";
import { DonationActions } from "../../state/charities/charities-reducer";
import { MaaserActions } from "../../state/maaser/maaser-reducer";
import { causes } from "./causes";
import DefaultIcon from "../../images/no_image_available.png";
import Logo from "../../images/logo.png";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { SearchActions } from "../../state/search/search-reducer";

const numResultsChoices = [10, 20, 30, 40, 50];

export default function Home() {
  const [results, setResults] = useState(null);
  const [donationAmt, setDonationAmt] = useState("");
  const [selectedCharity, setSelectedCharity] = useState({ name: "Every.org" });
  const [open, setOpen] = useState(false);
  const [showOverMaaserWarning, setShowOverMaaserWarning] = useState(false);
  const [showEmptyInputWarning, setshowEmptyInputWarning] = useState(false);

  const { charitiesState, charitiesDispatch } = useContext(CharitiesContext);
  const { maaserState, maaserDispatch } = useContext(MaaserContext);
  const { searchState, searchDispatch } = useContext(SearchContext);

  function handleKeywordInputChange(event) {
    searchDispatch({
      type: SearchActions.SET_KEYWORD_INPUT,
      value: event.target.value,
    });
  }

  function checkForKeywordEnter(event) {
    if (event.keyCode == 13) {
      event.target.blur();
      handleKeywordInputSubmit();
    }
  }

  function handleKeywordInputSubmit() {
    searchDispatch({
      type: SearchActions.SET_SEARCH_TYPE,
      value: searchTypes.KEYWORD,
    });
    searchByKeyword();
  }

  function handleCauseSelected(cause) {
    searchDispatch({
      type: SearchActions.SET_SEARCH_TYPE,
      value: searchTypes.CAUSE,
    });
    searchDispatch({
      type: SearchActions.SET_CAUSE_INPUT,
      value: cause,
    });
    searchByCause(cause);
  }

  function setNumSearchResults(number) {
    searchDispatch({
      type: SearchActions.SET_NUM_SEARCH_RESULTS,
      value: number,
    });
  }

  function handleClickOpen(charity) {
    setSelectedCharity(charity);
    setOpen(true);
  }

  function handleClose(donate) {
    setShowOverMaaserWarning(false);
    if (donate) {
      if (!donationAmt == "" && parseFloat(donationAmt) > 0) {
        processDonation();
        setOpen(false);
        setDonationAmt("");
        setshowEmptyInputWarning(false);
      } else {
        setshowEmptyInputWarning(true);
      }
    } else {
      setOpen(false);
      setDonationAmt("");
      setshowEmptyInputWarning(false);
    }
  }

  function handleDonationAmtChange(event) {
    const amount = event.target.value;
    if (amount === "" || /^\d+(\.\d{0,2})?$/.test(amount)) {
      setDonationAmt(amount);
    }
  }

  useEffect(() => {
    switch (searchState.searchType) {
      case searchTypes.KEYWORD: {
        searchByKeyword(searchState.keywordInput);
        break;
      }
      case searchTypes.CAUSE: {
        searchByCause(searchState.causeInput);
        break;
      }
    }
  }, [searchState.numSearchResults]);

  useEffect(() => {
    setshowEmptyInputWarning(false);
    if (parseFloat(donationAmt) > parseFloat(maaserState.maaser)) {
      setShowOverMaaserWarning(true);
    } else {
      setShowOverMaaserWarning(false);
    }
  }, [donationAmt]);

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

    maaserDispatch({
      type: MaaserActions.ADD_DONATION_AMOUNT,
      amount: donationAmt,
    });

    maaserDispatch({
      type: MaaserActions.SUBTRACT_MAASER,
      amount: donationAmt,
    });
  }

  function searchByKeyword() {
    startSkeleton();
    fetch(
      `https://partners.every.org/v0.2/search/${searchState.keywordInput}
      ?apiKey=pk_live_7ff644bd22f350332599315a92d916e7&take=${searchState.numSearchResults}`
    )
      .then((response) => response.json())
      .then((data) => {
        setResults(data.nonprofits);
      });
  }

  function searchByCause(selectedCause) {
    startSkeleton();
    fetch(
      `https://partners.every.org/v0.2/browse/${selectedCause.trim()}?apiKey=pk_live_7ff644bd22f350332599315a92d916e7&take=${
        searchState.numSearchResults
      }`
    )
      .then((response) => response.json())
      .then((data) => {
        setResults(data.nonprofits);
      });
  }

  function startSkeleton() {
    setResults("loading");
  }

  return (
    <div className="App">
      <div className="charity-search">
        <div className="search-bar">
          <TextField
            className="input"
            variant="standard"
            label="Search by Name"
            value={searchState.keywordInput}
            onChange={handleKeywordInputChange}
            onKeyDown={checkForKeywordEnter}
            onFocus={(e) =>
              e.target.setSelectionRange(0, e.target.value.length)
            }
          />
          <FormControl
            className="input"
            variant="standard"
            sx={{ minWidth: "150px" }}
          >
            <InputLabel id="cause-select-label">Select Cause</InputLabel>
            <Select labelId="cause-select-label" value={searchState.causeInput}>
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
          <FormControl
            className="input"
            variant="standard"
            sx={{ minWidth: "150px" }}
          >
            <InputLabel id="num-results-select-label">
              Number of results
            </InputLabel>
            <Select
              labelId="num-results-select-label"
              defaultValue={10}
              value={searchState.numSearchResults}
            >
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
        <div className="results">
          <Dialog
            open={open}
            onClose={() => handleClose(false)}
            sx={{ width: "100%" }}
          >
            <Box sx={{ width: "30vw" }}>
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
                <Box sx={{ height: "40px", marginTop: "20px" }}>
                  {showEmptyInputWarning && (
                    <Typography sx={{ color: "red", maxWidth: "100%" }}>
                      Please enter a valid number.
                    </Typography>
                  )}
                  {showOverMaaserWarning && !showEmptyInputWarning && (
                    <Typography sx={{ color: "red", maxWidth: "100%" }}>
                      You have entered an amount that is greater than your
                      maaser.
                    </Typography>
                  )}
                </Box>
              </DialogContent>
              <DialogActions
                sx={{ display: "flex", justifyContent: "space-between" }}
              >
                <div>
                  {maaserState.maaser > 0 ? (
                    <Typography variant="body1" sx={{ textAlign: "center" }}>
                      Maaser: ${maaserState.maaser.toFixed(2)}
                    </Typography>
                  ) : (
                    <Typography variant="body1" sx={{ textAlign: "center" }}>
                      No maaser at this time
                    </Typography>
                  )}
                </div>
                <div>
                  <Button onClick={() => handleClose(true)}>Donate</Button>
                  <Button onClick={() => handleClose(false)}>Cancel</Button>
                </div>
              </DialogActions>
            </Box>
          </Dialog>

          <List sx={{ minHeight: "95%" }}>
            {!results && (
              <ListItem sx={{ minHeight: "95%" }}>
                <Box className="home-info">
                  <img src={Logo} style={{ width: "14rem" }} />
                  <Typography sx={{ marginTop: "40px" }}>
                    Welcome to our platform, where you can track and support
                    charities that align with your values. Begin your
                    philanthropic journey by searching our comprehensive
                    database of registered nonprofits. Discover organizations
                    making a positive impact in areas such as education,
                    healthcare, environmental conservation, social justice, and
                    more. With our intuitive search function, you can find the
                    perfect charities to contribute to and make a difference.
                    Start exploring now and embark on a meaningful path of
                    giving back to the causes that matter most to you.
                  </Typography>
                </Box>
              </ListItem>
            )}
            {results && results.length === 0 && (
              <Typography sx={{ marginLeft: "30px" }}>No results</Typography>
            )}
            {results &&
              (results != "loading"
                ? results.map((charity, index) => (
                    <ListItem
                      className="profile"
                      key={index}
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
                            charity.description
                              ? charity.description + "..."
                              : ""
                          }
                        />
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
                  ))
                : Array.from({ length: 5 }, (_, index) => (
                    <ListItem key={index}>
                      <Skeleton
                        variant="circular"
                        animation="wave"
                        height={50}
                        sx={{ width: "5%", marginRight: "10px" }}
                      />
                      <Skeleton
                        variant="rounded"
                        animation="wave"
                        height={118}
                        sx={{ width: "95%" }}
                      />
                    </ListItem>
                  )))}
          </List>
        </div>
      </div>
    </div>
  );
}
