//create state varai
import PlugConnect from "@psychedelic/plug-connect";
import { useState, useEffect } from "react";
import { AuthClient } from "@dfinity/auth-client";
import {
  HttpAgent,
  Identity,
  Actor,
} from "../../../node_modules/@dfinity/agent";
import { TradeComponent } from "./TradPageComponents/TradeComponent";

import {
  Quotex_V5_backend,
  createActor,
} from "../../declarations/Quotex_V5_backend";
import TradingViewWidget from "./TradPageComponents/TradingView";
import { Grid } from "@mui/material";
import { Navigation } from "./Navigation";
import PositionList from "./TradPageComponents/PositionList";
import { AssetData } from "./AssetData";
import { AssetDetails } from "./AssetDetails";
// import LandingPage from "./LandingPage.";

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

// let authClient: AuthClient;
// const init = async () => {
//   try {
//     authClient = await AuthClient.create();
//   } catch (err) {
//     console.log(err);
//   }
// };
// let actor = Quotex_V5_backend;

const App = () => {
  const [currentAsset, setCurrentAsset] = useState<{
    asset_name: string;
    asset_id: number;
  }>({ asset_name: "ETH", asset_id: 1 });
  const [launched, setLaunched] = useState(true);
  const [isConnected, setConnect] = useState(false);
  const [positions, updatePosition] = useState<PositionDetails[]>([]);

  const assetList = [
    { asset_name: "ETH", asset_id: 1 },
    { asset_name: "BTC", asset_id: 0 },
    { asset_name: "SOL", asset_id: 4 },
  ];

  const handleSuccess = () => {
    setConnect(true);
    // const principalId = authClient.getIdentity().getPrincipal().toText();
    // setPrincipal(principalId);
    // setConnect(true);
    // Actor.agentOf(Quotex_V5_backend).replaceIdentity(authClient.getIdentity());
  };

  const addPosition = (position: PositionDetails) => {
    updatePosition((prev) => {
      return [...prev, position];
    });
  };

  const Connect = async () => {
    // if (!authClient) {
    //   console.log("authClient missing");
    // }
    // const APP_NAME = "Quotex";
    // const APP_LOGO = "https://nfid.one/icons/favicon-96x96.png";
    // const CONFIG_QUERY = `?applicationName=${APP_NAME}&applicationLogo=${APP_LOGO}`;
    // const identityProvider = `https://nfid.one/authenticate${CONFIG_QUERY}`;
    // authClient.login({
    //   identityProvider: identityProvider,
    //   onSuccess: handleSuccess,
    //   windowOpenerFeatures: `
    //       left=${window.screen.width / 2 - 525 / 2},
    //       top=${window.screen.height / 2 - 705 / 2},
    //       toolbar=0,location=0,menubar=0,width=525,height=705
    //     `,
    // });
    // const identity: Identity = authClient?.getIdentity();
    // const agent = new HttpAgent({ identity });
    // actor = createActor(`${process.env.CANISTER_ID_QUOTEX_V5_BACKEND}`, {
    //   agent,
    // });
  };

  useEffect(() => {}, []);

  return (
    <>
      {/* {launched ? ( */}
      <div>
        {" "}
        <Navigation login={handleSuccess} />
        <Grid justifyContent="space-evenly" rowGap={1} container>
          <Grid
            rowGap={1}
            className="tradingView"
            xs={12}
            md={7}
            container
            item
          >
            <Grid
              xs={12}
              sx={{
                backgroundColor: "#04072A",
                maxHeight: "50px",
              }}
              item
            >
              <AssetData
                currentAsset={currentAsset}
                assetList={assetList}
                changeCurrentAsset={(asset) => {
                  setCurrentAsset(asset);
                }}
              />
            </Grid>
            <Grid
              xs={12}
              sx={{
                backgroundColor: "#04072A",
                padding: "10px",
                height: "400px",
              }}
              item
            >
              <TradingViewWidget currentAsset={currentAsset.asset_name} />
            </Grid>
          </Grid>
          <Grid
            sx={{ backgroundColor: "#04072A" }}
            xs={12}
            md={4}
            container
            item
          >
            <TradeComponent
              isConnected={isConnected}
              addPosition={(position) => {
                addPosition(position);
              }}
              baseAsset={currentAsset.asset_name}
              asset_id={currentAsset.asset_id}
            />
          </Grid>
        </Grid>
        <Grid
          sx={{
            marginTop: "30px",
          }}
          justifyContent="space-evenly"
          rowGap={2}
          container
        >
          <Grid sx={{ backgroundColor: "#04072A" }} xs={12} md={7} item>
            <PositionList positionList={positions} />
          </Grid>
          <Grid
            sx={{ backgroundColor: "#04072A", padding: "10px" }}
            xs={12}
            md={4}
            item
          >
            <AssetDetails currentAsset={currentAsset} />
          </Grid>
        </Grid>
      </div>
      {/* ) : (
        <LandingPage
          Launch={() => {
            setLaunched(true);
          }}
        />
      )} */}
    </>
  );
};

export default App;
