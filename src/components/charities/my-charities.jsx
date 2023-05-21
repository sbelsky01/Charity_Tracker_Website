import React, { useContext, useState, useEffect } from "react";
import { CharitiesContext } from "../../state/charities/charities-context";
import { MaaserContext } from "../../state/maaser/maaser-context";
import DefaultCoverImage from "../../images/rect-gradient.png";
import {
  styled,
  IconButton,
  TextField,
  Button,
  Popover,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  Collapse,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Box,
  Paper,
  Skeleton,
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { MaaserActions } from "../../state/maaser/maaser-reducer";
import { DonationActions } from "../../state/charities/charities-reducer";

export default function MyCharities() {
  const { charitiesState, charitiesDispatch } = useContext(CharitiesContext);
  const { maaserState, maaserDispatch } = useContext(MaaserContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState(charitiesState.charities);
  const [selectedSearchTerm, setSelectedSearchTerm] = useState(null);
  const [selected, setSelected] = useState(false);
  const [selectedCharity, setSelectedCharity] = useState({ name: "Every.org" });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [donationAmt, setDonationAmt] = useState("");
  const [showOverMaaserWarning, setShowOverMaaserWarning] = useState(false);
  const [showEmptyInputWarning, setshowEmptyInputWarning] = useState(false);

  const handleFocus = (event) => {
    if (!selected) setAnchorEl(event.currentTarget);
    else setSelected(false);
    console.log(anchorEl);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  function handleSearchTermChange(event) {
    const value = event.target.value;
    setSearchTerm(value);
    const filteredCharities = charitiesState.charities.filter((charity) =>
      charity.name.toLowerCase().includes(value.toLowerCase())
    );
    setSearchResults(filteredCharities);
    setSelected(false);
  }

  function handleCharitySelect(charity) {
    setSelectedSearchTerm(charity);
    setSearchTerm(charity.name);
    setSelected(true);
    setAnchorEl(null);
  }

  function handleClickOpen(charity) {
    setSelectedCharity(charity);
    setDialogOpen(true);
  }

  function handleDialogClose(donate) {
    setShowOverMaaserWarning(false);
    if (donate) {
      if (!donationAmt == "" && parseFloat(donationAmt) > 0) {
        processDonation();
        setDialogOpen(false);
        setDonationAmt("");
        setshowEmptyInputWarning(false);
      } else {
        setshowEmptyInputWarning(true);
      }
    } else {
      setDialogOpen(false);
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

  function processDonation() {
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

  useEffect(() => {
    setshowEmptyInputWarning(false);
    if (parseFloat(donationAmt) > parseFloat(maaserState.maaser)) {
      setShowOverMaaserWarning(true);
    } else {
      setShowOverMaaserWarning(false);
    }
  }, [donationAmt]);

  return (
    <div className="App">
      <div className="content">
        <div className="top-row" style={{ marginBottom: "70px" }}>
          <Grid container spacing={2}>
            <Grid item sm={8}>
              <TextField
                variant="standard"
                label="search for a charity"
                value={searchTerm}
                onChange={handleSearchTermChange}
                onFocus={handleFocus}
                fullWidth
              />
            </Grid>
            <Grid
              item
              sm={4}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
              }}
            >
              {maaserState.maaser > 0 ? (
                <Typography
                  variant="h4"
                  sx={{ textAlign: "center", verticalAlign: "bottom" }}
                >
                  Maaser: ${maaserState.maaser.toFixed(2)}
                </Typography>
              ) : (
                <Typography variant="h5" sx={{ textAlign: "center" }}>
                  No maaser at this time
                </Typography>
              )}
            </Grid>
          </Grid>
        </div>
        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          disableAutoFocus={true}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
        >
          <List>
            <ListItem
              sx={
                searchResults.length === 0
                  ? { display: "relative" }
                  : { display: "none" }
              }
            >
              no charities match your search
            </ListItem>
            {searchResults.map((charity) => (
              <ListItem key={charity.ein}>
                <ListItemButton onClick={() => handleCharitySelect(charity)}>
                  <ListItemText>{charity.name}</ListItemText>
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Popover>
        {selectedSearchTerm && (
          <CharityCard
            charity={selectedSearchTerm}
            handleClickOpen={handleClickOpen}
          />
        )}
        <Dialog open={dialogOpen} onClose={() => handleDialogClose(false)}>
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
                    You have entered an amount that is greater than your maaser.
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
                <Button onClick={() => handleDialogClose(true)}>Donate</Button>
                <Button onClick={() => handleDialogClose(false)}>Cancel</Button>
              </div>
            </DialogActions>
          </Box>
        </Dialog>
        {charitiesState.charities.length > 0 ? (
          <>
            <Typography variant="h5" sx={{ margin: "40px 0 20px 0" }}>
              Other charities you've donated to:
            </Typography>
            <Grid container spacing={2}>
              {charitiesState.charities.map(
                (charity) =>
                  charity.name !== selectedSearchTerm?.name && (
                    <Grid item sm={12} md={6} lg={4}>
                      <CharityCard
                        charity={charity}
                        handleClickOpen={handleClickOpen}
                      />
                    </Grid>
                  )
              )}
            </Grid>
          </>
        ) : (
          <>
            <Paper
              sx={{
                margin: "50px",
                padding: "50px",
                backgroundColor: "#dde7db",
              }}
            >
              <Typography variant="h6">
                Your generosity has the power to change lives. Currently, there
                are no charities in your donation history. Keep track of the
                nonprofits you've supported and witness the impact of your
                contributions. Start your journey of giving today, and together,
                let's create a brighter future for those in need.
              </Typography>
            </Paper>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                margin: "0 50px",
              }}
            >
              {Array.from(Array(3), () => (
                <Skeleton
                  variant="rounded"
                  sx={{ width: "30%" }}
                  height={220}
                  animation="wave"
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const ExpandMoreWrapper = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

function CharityCard(props) {
  const charity = props.charity;
  const [expanded, setExpanded] = useState(false);
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  function handleClickOpen() {
    props.handleClickOpen(charity);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Card sx={{ boxShadow: "0 1px 8px rgba(0, 0, 0, 0.3)" }}>
        <CardMedia
          component="img"
          height="194"
          image={charity.coverImageUrl || DefaultCoverImage}
        />

        <CardHeader title={charity.name}></CardHeader>
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            {charity.description ? charity.description + "..." : ""}
          </Typography>
        </CardContent>
        <CardActions
          disableSpacing
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div>
            <ExpandMoreWrapper expand={expanded} onClick={handleExpandClick}>
              <ExpandMore />
            </ExpandMoreWrapper>
            <Typography>Total Donated: ${charity.totalDonations}</Typography>
          </div>
          <div>
            <IconButton onClick={() => handleClickOpen(charity)}>
              <VolunteerActivismIcon />
            </IconButton>
          </div>
        </CardActions>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
            {charity.donations.map((donation) => (
              <p>
                {donation.date} {donation.amount}
              </p>
            ))}
          </CardContent>
        </Collapse>
      </Card>
    </div>
  );
}
