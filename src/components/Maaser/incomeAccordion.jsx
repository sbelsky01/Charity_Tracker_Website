import React, { useState } from "react";
import {
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
} from "@mui/material";
import { months } from "../months.jsx";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export function IncomeAccordion(props) {
  const income = props.income;
  const [expandedPanel, setExpandedPanel] = useState("");
  const now = new Date();

  function handleToggle(year) {
    year == expandedPanel ? setExpandedPanel("") : setExpandedPanel(year);
  }

  function getFormattedDate(dateString) {
    const dateParts = dateString.split("-");
    const month = parseInt(dateParts[1]) - 1;
    const day = parseInt(dateParts[2]);

    return months[month] + " " + day;
  }

  function formatted(number) {
    return number.toLocaleString("en-US", {
      style: "decimal",
      useGrouping: true,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
  return (
    <>
      {income &&
        income.map((group) => (
          <Accordion
            key={group.year}
            expanded={expandedPanel == group.year}
            onChange={() => handleToggle(group.year)}
            defaultExpanded={group.year == now.getFullYear()}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{ backgroundColor: "lightgrey" }}
            >
              <Typography> {group.year}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {group.list.map((incomeLine, index) => (
                <div style={{ margin: "8px 25px" }} key={index}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-end",
                      paddingRight: "4px",
                    }}
                  >
                    <div>
                      <Typography variant="h6">
                        {incomeLine.description}
                      </Typography>
                      <Typography>
                        {getFormattedDate(incomeLine.date)}
                      </Typography>
                    </div>
                    <div>
                      <Typography variant="h6">
                        ${formatted(parseFloat(incomeLine.amt))}
                      </Typography>
                    </div>
                  </div>
                  <Divider />
                </div>
              ))}
            </AccordionDetails>
          </Accordion>
        ))}
    </>
  );
}
