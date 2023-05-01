import React, { useContext, useState } from "react";
import { CharitiesContext } from "../../state/charities/charities-context";
import DefaultCoverImage from "../../images/charity-and-donation-icons-vector-merged-layers-gradient.jpg";
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
  const [selected, setSelected] = useState(null);

  const handleFocus = (event) => {
    setAnchorEl(event.currentTarget);
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
  }

  function handleCharitySelect(charity) {
    setSelected(charity);
    setSearchTerm(charity.name);
    setAnchorEl(null);
  }

  return (
    <div className="App">
      <div className="content">
        <TextField
          variant="standard"
          label="search for a charity"
          onChange={handleSearchTermChange}
          value={searchTerm}
          onFocus={handleFocus}
          fullWidth
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
        {selected ? (
          <>
            <CharityCard charity={selected} /> <hr />
          </>
        ) : (
          <br />
        )}

        {charitiesState.charities.map((charity) => (
          <CharityCard charity={charity} />
        ))}
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
    <Card>
      <CardMedia
        component="img"
        height="194"
        image={charity.coverImageUrl || DefaultCoverImage}
        alt="Paella dish"
      />

      <CardHeader title={charity.name} />
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
