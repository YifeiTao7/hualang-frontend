/* eslint-disable react/prop-types */
import React from "react";
import { ButtonGroup, Button } from "@mui/material";

const TimePeriodSelector = ({ period, setPeriod }) => {
  return (
    <ButtonGroup variant="contained">
      <Button onClick={() => setPeriod("week")} color={period === "week" ? "primary" : "default"}>
        周
      </Button>
      <Button onClick={() => setPeriod("month")} color={period === "month" ? "primary" : "default"}>
        月
      </Button>
      <Button onClick={() => setPeriod("year")} color={period === "year" ? "primary" : "default"}>
        年
      </Button>
    </ButtonGroup>
  );
};

export default TimePeriodSelector;
