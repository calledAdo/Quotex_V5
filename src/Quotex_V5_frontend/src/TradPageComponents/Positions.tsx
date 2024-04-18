import React, { useEffect, useState } from "react";
import axios from "axios";
import { Grid } from "@mui/material";

//every multiplied by 100000

const calcLongPNL = (markPrice: string, details: PositionDetails): number => {
  const positionValue = details.positionSize * Number(markPrice);
  const marginValue = details.margin * Number(markPrice);
  const currentMargin = positionValue - details.debt;
  const pnl = ((currentMargin - marginValue) * 100) / marginValue;

  return pnl;
};

const calcShortPNL = (markPrice: string, details: PositionDetails): number => {
  const debtValue = details.debt * Number(markPrice);

  const currentMargin = details.positionSize - debtValue;
  const pnl = ((currentMargin - details.margin) * 100) / details.margin;

  return pnl;
};

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

type Props = {
  details: PositionDetails;
};
//asset pair//entry price//mark Price//pnl //positionSize//margin
export const Positions = ({ details }: Props) => {
  const [markPrice, setMarkPrice] = useState<any>("1.00");
  const [pnl, setPNl] = useState(0.0);
  //invariants asset pair,entry price

  const pnlColor = pnl < 0 ? "red" : "white";
  const CalculatePNL = async () => {
    let newpnl;
    if (details.isLong) {
      newpnl = calcLongPNL(markPrice, details);
    } else {
      newpnl = calcShortPNL(markPrice, details);
    }
    setPNl(newpnl);
  };

  const updateMarkPrice = async () => {
    try {
      const { data } = await axios.get("https://api.coinlore.net/api/tickers/");

      const coinStats = data.data[details.asset_details.asset_id];
      const { price_usd } = coinStats;
      setMarkPrice(price_usd);
      await CalculatePNL();
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
  }, []);
  return (
    <Grid
      justifyContent="space-between"
      rowGap={1}
      container
      sx={{ backgroundColor: "#0d0f34", color: "white", padding: "10px" }}
    >
      <Grid item>
        <Grid
          className="underlined"
          sx={{ color: "#D9D9D9", marginBottom: "8px" }}
          item
        >
          Symbol
        </Grid>
        <Grid item>{details.asset_details.asset_name}-USD</Grid>
      </Grid>
      <Grid item>
        <Grid
          item
          sx={{
            color: "#D9D9D9",
            marginBottom: "8px",
          }}
        >
          Mark Price
        </Grid>
        <Grid item>{markPrice}$</Grid>
      </Grid>
      <Grid item>
        <Grid item sx={{ color: "#D9D9D9", marginBottom: "8px" }}>
          Margin
        </Grid>
        <Grid item>
          {details.margin}
          {details.isLong ? details.asset_details.asset_name : "USD"}
        </Grid>
      </Grid>
      <Grid item>
        <Grid item sx={{ color: "#D9D9D9", marginBottom: "8px" }}>
          Position Size
        </Grid>
        <Grid item>
          {details.positionSize}
          {details.isLong ? details.asset_details.asset_name : "USD"}
        </Grid>
      </Grid>
      <Grid item>
        <Grid item sx={{ color: "#D9D9D9", marginBottom: "8px" }}>
          PNL
        </Grid>
        <Grid
          sx={{
            backgroundColor: "green",
            color: "white",
            padding: "5px",
          }}
          item
        >
          {pnl.toString().slice(0, 5)}%
        </Grid>
      </Grid>
    </Grid>
  );
};
