import React, { useEffect, useState } from "react";
import { Button, Grid, Menu, MenuItem, Stack, Typography } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

import axios from "axios";
interface Assets {
  asset_name: string;
  asset_id: number;
}
interface Props {
  assetList: Assets[];
  currentAsset: Assets;
  changeCurrentAsset: (params: Assets) => void;
}

interface AssetProp {
  asset: Assets;
}

export const AssetData = ({
  assetList,
  changeCurrentAsset,
  currentAsset,
}: Props) => {
  const [anchorElement, setAnchorElement] = useState<null | HTMLElement>(null);

  const [details, setDetails] = useState({
    price_usd: "000.00",
    percent_change_24h: "00.00",
    percent_change_1h: "00.00",
  });

  const open = Boolean(anchorElement);

  const updateChanges = async () => {
    try {
      const { data } = await axios.get("https://api.coinlore.net/api/tickers/");
      const coinStats = data.data[currentAsset.asset_id];
      const { percent_change_24h, percent_change_1h, price_usd } = coinStats;
      //console.log(coinStats)
      setDetails({
        percent_change_1h,
        percent_change_24h,
        price_usd,
      });
    } catch (err) {
      console.log(err);
    }
  };
  const handleClose = (selected_asset = currentAsset) => {
    setAnchorElement(null);
    if (selected_asset !== currentAsset) {
      changeCurrentAsset(selected_asset);
    }
  };
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElement(event.currentTarget);
  };
  const assetsMenuItems = assetList.filter(function (asset) {
    return asset.asset_name !== currentAsset.asset_name;
  });

  useEffect(() => {
    axios
      .get("https://api.coingecko.com/api/v3/coins/ethereum")
      .then((res: any) => {
        console.log("eth usd", res.data.market_data.current_price.usd);
      });
    const interval = setInterval(() => {
      updateChanges();
      axios
        .get("https://api.coingecko.com/api/v3/coins/ethereum")
        .then((res: any) => {
          console.log("eth usd", res.data.market_data.current_price.usd);
        });
    }, 5000);
    return () => {
      clearInterval(interval);
    };
  }, [currentAsset]);
  return (
    <div>
      <Stack
        direction="row"
        sx={{ color: "#D9D9D9" }}
        justifyContent="flex-start"
        spacing={3}
      >
        <Button
          onClick={handleClick}
          sx={{
            flexGrow: 1,
            maxWidth: "400px",
            "& .MuiButton-endIcon": { color: "white" },
          }}
          id="asset_selection_button"
          aria-control={open ? "asset_selection_button" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          endIcon={<KeyboardArrowDownIcon />}
        >
          <Typography
            variant="h5"
            sx={{ color: "white", marginRight: 0, width: "100%" }}
          >
            {currentAsset.asset_name}/USD
          </Typography>
        </Button>
        <Stack sx={{ color: "white" }}>
          <Typography>Price</Typography>
          <Typography>${details.price_usd}</Typography>
        </Stack>
        <Stack>
          <Typography>1h Change</Typography>
          <Typography
            sx={{
              color: `${
                Number(details.percent_change_1h) <= 0 ? "#F90B0B" : "#25DF38"
              }`,
            }}
          >
            {details.percent_change_1h}%
          </Typography>
        </Stack>
        <Stack sx={{ display: { xs: "none", md: "flex" } }}>
          <Typography>24h Change</Typography>
          <Typography
            sx={{
              color: `${
                Number(details.percent_change_24h) <= 0 ? "#F90B0B" : "#25DF38"
              }`,
            }}
          >
            {details.percent_change_24h}%
          </Typography>
        </Stack>
      </Stack>
      <Menu
        id="assets_selection menu"
        anchorEl={anchorElement}
        sx={{ padding: 0, minwidth: "500px" }}
        open={open}
        MenuListProps={{ "aria-labelledby": "asset_selection_button" }}
        onClick={() => handleClose()}
      >
        {assetsMenuItems.map((asset) => {
          return (
            <MenuItem
              sx={{ backgroundColor: "#1C1D29", margin: 0 }}
              key={asset.asset_id}
              onClick={() => {
                handleClose(asset);
              }}
            >
              <Asset asset={asset}></Asset>
            </MenuItem>
          );
        })}
      </Menu>
    </div>
  );
};

//Asset Component

const Asset = ({ asset }: AssetProp) => {
  const [details, setDetails] = useState({
    price_usd: "000.00",
    percent_change_24h: "00.00",
    percent_change_1h: "00.00",
  });

  const updateChanges = async () => {
    try {
      const { data } = await axios.get("https://api.coinlore.net/api/tickers/");
      const coinStats = data.data[asset.asset_id];
      const { percent_change_24h, percent_change_1h, price_usd } = coinStats;
      //console.log(coinStats)
      setDetails({
        percent_change_1h,
        percent_change_24h,
        price_usd,
      });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    // const interval = setInterval(() => {
    updateChanges();
    // }, 5000);
    // return () => {
    //   clearInterval(interval);
    // };
  }, []);
  return (
    <Stack direction="row" sx={{ backgroundColor: "#1C1D29" }} spacing={2}>
      <Button sx={{ flexGrow: 1 }}>
        <Typography variant="h5" sx={{ color: "white" }}>
          {asset.asset_name}/USD
        </Typography>
      </Button>
      <Stack sx={{ color: "white" }}>
        <Typography>Price</Typography>
        <Typography>${details.price_usd}</Typography>
      </Stack>
      <Stack>
        <Typography sx={{ color: "white" }}>1h Change</Typography>
        <Typography
          sx={{
            color: `${
              Number(details.percent_change_1h) <= 0 ? "#F90B0B" : "#25DF38"
            }`,
          }}
        >
          {details.percent_change_1h}%
        </Typography>
      </Stack>
    </Stack>
  );
};
