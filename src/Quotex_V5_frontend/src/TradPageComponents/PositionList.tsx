import React, { useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { Positions } from "./Positions";
import { Stack } from "@mui/material";

type PositionDetails = {
  asset_details: {
    asset_name: string;
    asset_id: number;
  };
  isLong: boolean;
  entryPrice: string;
  positionSize: number;
  margin: number;
  debt: number;
};

interface Props {
  positionList: PositionDetails[];
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function PositionList({ positionList }: Props) {
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%", minHeight: "200px" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          sx={{
            "& .MuiTabs-indicator ": {
              backgroundColor: "#0300AD",
            },
            "& .Mui-selected": {
              color: "#0300AD",
            },
          }}
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab sx={{ color: "white" }} label="Positions" {...a11yProps(0)} />
          <Tab sx={{ color: "white" }} label="Orders" {...a11yProps(1)} />
          <Tab sx={{ color: "white" }} label="History" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <Stack>
        {positionList.map((positionsDetails) => {
          return <Positions details={positionsDetails} />;
        })}
      </Stack>
    </Box>
  );
}
