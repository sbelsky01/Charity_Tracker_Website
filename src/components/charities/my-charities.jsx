import React, { useContext, useState } from "react";
import { CharitiesContext } from "../../state/charities/charities-context";
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
  Avatar,
  CardMedia,
  CardContent,
  CardActions,
  Collapse,
  Grid,
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import DefaultIcon from "../../images/default-charity-logo-transparent-edges.png";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";

export default function MyCharities() {
  const { charitiesState, charitiesDispatch } = useContext(CharitiesContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState(charitiesState.charities);
  const [selectedCharity, setSelectedCharity] = useState(null);
  const [selected, setSelected] = useState(false);

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
    setSelectedCharity(charity);
    setSearchTerm(charity.name);
    setSelected(true);
    setAnchorEl(null);
  }

  return (
    <div className="App">
      <div className="content">
        <TextField
          variant="standard"
          label="search for a charity"
          value={searchTerm}
          onChange={handleSearchTermChange}
          onFocus={handleFocus}
          fullWidth
          sx={{ marginBottom: "40px" }}
        />
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
          {console.log(anchorEl)}
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
        {selectedCharity !== null && <CharityCard charity={selectedCharity} />}
        <Typography variant="h5" sx={{ margin: "40px 0 20px 0" }}>
          Other charities you've donated to:
        </Typography>
        <Grid container spacing={2}>
          {charitiesState.charities.map(
            (charity) =>
              charity.name !== selectedCharity?.name && (
                <Grid item sm={12} md={6} lg={4}>
                  <CharityCard charity={charity} />
                </Grid>
              )
          )}
        </Grid>
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
  return (
    <Card sx={{ boxShadow: "0 1px 8px rgba(0, 0, 0, 0.3)" }}>
      <CardMedia
        component="img"
        height="194"
        image={charity.coverImageUrl || DefaultCoverImage}
      />

      <CardHeader
        title={charity.name}
        // avatar={<Avatar src={charity.logoUrl}></Avatar>}
      ></CardHeader>
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {charity.description ? charity.description + "..." : ""}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <ExpandMoreWrapper expand={expanded} onClick={handleExpandClick}>
            <ExpandMore />
          </ExpandMoreWrapper>
          <IconButton>
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
  );
}
