import React, { useState, useEffect } from "react";
import { Principal } from "@dfinity/principal";
import {
  ButtonGroup,
  Grid,
  Button,
  TextField,
  InputAdornment,
  Slider,
  Typography,
} from "@mui/material";
import axios from "axios";

import { formatUnits, parseUnits } from "ethers";
import marks from "../marks";

//when leverage is changed
//if short
//positionSize = positonValue = collateral  x leverage
//if long
//positionSize= collateral x levarage
//positionValue = positionSize x price
//positionSize is changed
//collateral = positionSize/leverage

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
  baseAsset: string;
  asset_id: number;
  isConnected: boolean;
  addPosition: (params: PositionDetails) => void;
}

export const TradeComponent = ({
  baseAsset,
  asset_id,
  addPosition,
  isConnected,
}: Props) => {
  const [markPrice, setMarkPrice] = useState("0.00");
  const [tradeDetails, setDetails] = useState<{
    isLong: boolean;
    leverage: number;
    collateral: string;
  }>({
    isLong: true,
    leverage: 1,
    collateral: "",
  });

  const getPositionSize = () => {
    return Number(tradeDetails.collateral) * tradeDetails.leverage;
  };
  const numberify = (str: string): number => {
    let num;
    if ((str = "")) {
      num = 0;
    } else {
      num = Number(str);
    }
    return num;
  };

  const calcDebt = (): number => {
    let trueDebt;
    let debt = getPositionSize() - numberify(tradeDetails.collateral);
    if (tradeDetails.isLong) {
      trueDebt = debt * Number(markPrice);
    } else {
      trueDebt = debt / Number(markPrice);
    }
    return trueDebt;
  };
  const openPosition = () => {
    let position: PositionDetails = {
      asset_details: {
        asset_id: asset_id,
        asset_name: baseAsset,
      },
      isLong: tradeDetails.isLong,
      entryPrice: markPrice,
      positionSize: getPositionSize(),
      margin: Number(tradeDetails.collateral),
      debt: calcDebt(),
    };
    if (position.margin > 0 && isConnected) {
      addPosition(position);
    }
    console.log(position);
  };
  const getPositionValue = () => {
    const size = getPositionSize();
    return tradeDetails.isLong
      ? formatUnits(
          parseUnits(size.toString(), 4) * parseUnits(markPrice, 5),
          9
        )
      : size;
  };

  const connectionCheck = (): string => {
    if (isConnected) {
      return tradeDetails.isLong ? "LONG" : "SHORT";
    } else {
      return "Connect Wallet";
    }
  };
  const collateralChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const collateral =
      Number(e.currentTarget.value) >= 0 ? e.currentTarget.value : "";
    setDetails({ ...tradeDetails, collateral });
  };

  const updateMarkPrice = async () => {
    try {
      const { data } = await axios.get("https://api.coinlore.net/api/tickers/");

      const coinStats = data.data[asset_id];
      const { price_usd } = coinStats;

      setMarkPrice(price_usd);
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
  }, [baseAsset, asset_id]);
  return (
    <Grid
      justifyContent="center"
      rowSpacing={2}
      padding="20px"
      sx={{ color: "#D9D9D9" }}
      container
    >
      <Grid container item>
        <ButtonGroup
          sx={{ backgroundColor: "#2A2D4A", height: "45px" }}
          variant="contained"
          fullWidth
        >
          <Button
            sx={{
              backgroundColor: `${tradeDetails.isLong ? "#0300AD" : "#1C1D29"}`,
            }}
            onClick={() => {
              setDetails((prevState) => {
                return { ...prevState, isLong: true };
              });
            }}
          >
            Long
          </Button>
          <Button
            onClick={() => {
              setDetails((prevState) => {
                return { ...prevState, isLong: false };
              });
            }}
            sx={{
              backgroundColor: `${tradeDetails.isLong ? "#1C1D29" : "#0300AD"}`,
            }}
          >
            Short
          </Button>
        </ButtonGroup>
      </Grid>

      <Grid
        justifyContent="space-between"
        xs={12}
        sx={{ backgroundColor: "#1C1D29", marginTop: "20px", padding: "10px" }}
        container
        item
      >
        <Grid xs={7} item>
          Collateral
        </Grid>
        <Grid xs={4} item>
          Balance
        </Grid>
        <Grid xs={12} item>
          <TextField
            onChange={collateralChange}
            type="number"
            variant="filled"
            sx={{
              margin: 0,
              "& .MuiInputBase-input": {
                fontSize: 20,
                fontWeight: "bold",
                color: "white", // Change font weight to bold
                // Change font style to italic
              },
              "& .MuiInputAdornment-root": {
                color: "white",
              },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Typography
                    sx={{
                      fontSize: 20,
                      fontWeight: "bold",
                    }}
                  >
                    {tradeDetails.isLong ? baseAsset : "USD"}
                  </Typography>{" "}
                </InputAdornment>
              ),
            }}
            fullWidth
          />
        </Grid>
      </Grid>
      <Grid
        justifyContent="space-between"
        sx={{
          backgroundColor: "#1C1D29",
          marginTop: "20px",
          padding: "10px",
        }}
        xs={12}
        container
        item
      >
        <Grid xs={7} item>
          $ {getPositionValue()}
        </Grid>
        <Grid xs={4} item>
          Leverage:{tradeDetails.leverage}x
        </Grid>
        <Grid xs={12} item>
          <TextField
            type="number"
            variant="filled"
            sx={{
              margin: 0,
              "& .MuiInputBase-input": {
                fontSize: 20,
                fontWeight: "bold",
                color: "white", // Change font weight to bold
                // Change font style to italic
              },
              "& .MuiInputAdornment-root": {
                color: "white",
              },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Typography
                    sx={{
                      fontSize: 20,
                      fontWeight: "bold",
                    }}
                  >
                    {tradeDetails.isLong ? baseAsset : "USD"}
                  </Typography>{" "}
                </InputAdornment>
              ),
            }}
            value={tradeDetails.collateral == "" ? "" : getPositionSize()}
            fullWidth
          />
        </Grid>
      </Grid>
      <Grid sx={{ padding: "12px" }} container item>
        <Slider
          onChangeCommitted={(_, value) => {
            setDetails({ ...tradeDetails, leverage: value as number });
          }}
          sx={{
            color: "#0300AD",
            "& .MuiSlider-markLabel": {
              color: "#D9D9D9",
              font: "0.1rem",
            },
            "& .MuiSlider-rail": {
              color: "gray",
            },
            "& .MuiSlider-mark": {
              height: "7px",
              color: "#D9D9D9",
            },
          }}
          defaultValue={1}
          step={1}
          min={1}
          max={50}
          marks={marks}
        />
      </Grid>
      <Grid
        justifyContent="space-between"
        sx={{ marginTop: "15px" }}
        rowGap={2}
        container
        item
      >
        <Grid xs={6} item>
          Pair
        </Grid>
        <Grid xs={6} item>
          {baseAsset}-USD
        </Grid>
        <Grid xs={6} item>
          Entry Price
        </Grid>
        <Grid xs={6} item>
          ${markPrice}
        </Grid>
      </Grid>
      <Grid xs={12} item>
        <Button
          onClick={openPosition}
          sx={{ backgroundColor: "#0300AD" }}
          variant="contained"
          fullWidth
        >
          <Typography>{connectionCheck()}</Typography>
        </Button>
      </Grid>
    </Grid>
  );
};
