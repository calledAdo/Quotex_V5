import { Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import axios from "axios";

interface Details {
  percent_change_24h: "string";
  percent_change_7d: "string";
  trade_volume: "";
}

interface Asset {
  asset_name: string;
  asset_id: number;
}
interface Props {
  currentAsset: Asset;
}

const FormatCash = (numberString: string) => {
  let returnValue;
  let n = Number(numberString);
  if (n < 1e3) return n.toString();
  if (n >= 1e3 && n < 1e6) {
    return (n / 1e3).toFixed(2) + "K";
  }
  if (n >= 1e6 && n < 1e9) {
    return (n / 1e6).toFixed(2) + "M";
  }
  if (n >= 1e9 && n < 1e12) {
    return (n / 1e9).toFixed(2) + "B";
  }
  if (n >= 1e12 && n < 1e15) {
    return (n / 1e12).toFixed(2) + "T";
  }
};
export const AssetDetails = ({ currentAsset }: Props) => {
  const [assetDetails, setAssetDetails] = useState<{
    market_cap_usd: string;
    volume24: string;
    tsupply: string;
    csupply: string;
  }>({
    market_cap_usd: "0.00",
    volume24: "0.00",
    tsupply: "0.00",
    csupply: "0.00",
  });

  const updateMarkPrice = async () => {
    try {
      const { data } = await axios.get("https://api.coinlore.net/api/tickers/");
      const coinStats = data.data[currentAsset.asset_id];
      const { market_cap_usd, volume24, tsupply, csupply } = coinStats;
      setAssetDetails({ market_cap_usd, volume24, csupply, tsupply });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      updateMarkPrice();
    }, 5000);
    return () => {
      clearInterval(interval);
    };
  }, [currentAsset]);

  return (
    <Grid sx={{ color: "white" }} rowGap={3} container>
      <Grid xs={12} item>
        <Typography variant="h5">{currentAsset.asset_name}</Typography>
      </Grid>
      <Grid xs={8} item>
        Market Cap
      </Grid>
      <Grid xs={4} item>
        ${FormatCash(assetDetails.market_cap_usd)}
      </Grid>
      <Grid xs={8} item>
        24h Volume
      </Grid>
      <Grid xs={4} item>
        ${FormatCash(assetDetails.volume24)}
      </Grid>
      <Grid xs={8} item>
        Total Supply
      </Grid>
      <Grid xs={4} item>
        {FormatCash(assetDetails.tsupply)}
      </Grid>
      <Grid xs={8} item>
        Circulating Supply
      </Grid>
      <Grid xs={4} item>
        {FormatCash(assetDetails.csupply)}
      </Grid>
    </Grid>
  );
};
