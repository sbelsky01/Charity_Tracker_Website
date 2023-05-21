import React, { useState, useRef, useEffect } from "react";
import DefaultCoverImage from "../../images/rect-gradient.png";
import {
  styled,
  Typography,
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  Collapse,
  IconButton,
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import { months } from "../months";

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

export function CharityCard(props) {
  const charity = props.charity;
  const [expanded, setExpanded] = useState(false);

  const cardRef = useRef(null);
  const [cardWidth, setCardWidth] = useState(0);

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setCardWidth(entry.contentRect.width);
      }
    });

    if (cardRef.current) {
      resizeObserver.observe(cardRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  function handleClickOpen() {
    props.handleClickOpen(charity);
  }

  function getFormattedDate(dateString) {
    const dateObj = new Date(dateString);
    const year = dateObj.getFullYear();
    const month = months[dateObj.getMonth()];
    const date = dateObj.getDate();
    return year + "\t" + month + " " + date;
  }

  return (
    <Card
      sx={{
        boxShadow: "0 1px 8px rgba(0, 0, 0, 0.3)",
        width: "100%",
      }}
      ref={cardRef}
    >
      <div
        style={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div>
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
        </div>
        <div>
          <CardActions
            disableSpacing
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ display: "flex" }}>
              <ExpandMoreWrapper
                expand={expanded}
                onClick={handleExpandClick}
                sx={{ padding: "0, auto", marginTop: "8px" }}
              >
                <ExpandMore />
              </ExpandMoreWrapper>
              <IconButton onClick={() => handleClickOpen(charity)}>
                <VolunteerActivismIcon />
              </IconButton>
            </div>
            <div>
              <Typography sx={{ padding: "8px" }}>
                Total Donated: ${charity.totalDonations}
              </Typography>
            </div>
          </CardActions>
        </div>
      </div>
      <div style={{ width: cardWidth, position: "absolute" }}>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent
            sx={{
              backgroundColor: "white",
              boxShadow: "2px 8px 8px rgba(0, 0, 0, 0.3)",
              borderRadius: "7px",
              marginTop: "1px",
              //   marginLeft: "10px",
              //   borderBottomLeftRadius: "7px",
              //   borderBottomRightRadius: "7px",
            }}
          >
            <Typography variant="h6" sx={{ marginBottom: "19px" }}>
              Previous donations:
            </Typography>
            {charity.donations.map((donation) => (
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>
                  <Typography>{getFormattedDate(donation.date)}</Typography>
                </div>
                <div>
                  <Typography>
                    ${parseFloat(donation.amount).toFixed(2)}
                  </Typography>
                </div>
              </div>
            ))}
          </CardContent>
        </Collapse>
      </div>
    </Card>
  );
}
