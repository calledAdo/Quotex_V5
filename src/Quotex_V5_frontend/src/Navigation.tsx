import PlugConnect from "@psychedelic/plug-connect";
import {
  AppBar,
  Button,
  Grid,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import logo from "/src/logo.svg";
import React, { useState } from "react";

interface Props {
  login: () => void;
}
export const Navigation = ({ login }: Props) => {
  const [principal, setPrincipal] = useState("");
  return (
    <AppBar
      position="static"
      sx={{ backgroundColor: "#04072A", marginBottom: "15px" }}
    >
      <Toolbar>
        <Grid sx={{ flexGrow: 1 }}>
          <img src={logo} alt="Quotex" className="logo" />
        </Grid>
        <Stack direction="row" gap={1}>
          <Button>Docs</Button>
          <PlugConnect
            dark={true}
            title={
              principal == ""
                ? "Connect"
                : `${
                    principal.slice(0, 5) +
                    ".." +
                    principal.slice(principal.length - 3)
                  }`
            }
            onConnectCallback={() => {
              login();
              setPrincipal("bd3sg-teaaa-aaaaa-qaaba-cai");
            }}
          />
          {/* <Button
            onClick={login}
            sx={{ backgroundColor: "#0300AD" }}
            variant="contained"
          >
            {principal
              ? `${
                  principal.slice(0, 5) +
                  ".." +
                  principal.slice(principal.length - 3)
                }`
              : "Connect"}
          </Button> */}
        </Stack>
      </Toolbar>
    </AppBar>
  );
};
