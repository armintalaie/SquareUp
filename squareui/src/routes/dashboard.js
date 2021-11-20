import {
  Button,
  Paper,
  Container,
  Box,
  Stack,
  Typography,
  TextField,
} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Tile from "../components/tile";
import Label from "../components/label";
import { useEffect, useState } from "react";
import { ActionButton } from "../theme";
import { useNavigate, useLocation } from "react-router";
const API_LINK = "https://us-central1-square-4797a.cloudfunctions.net/";

export default function Dashaboard() {
  const { state } = useLocation();
  const { program, stores, partnerid, storeId, conversionRate } =
    state == null
      ? {
          program: "N/A",
          stores: [".....", ".....", ".....", ".....", "....."],
          partnerid: "N/A",
          id: "N/A",
          conversionRate: 1,
        }
      : state;
  console.log(storeId + "  " + program);
  console.log(localStorage.getItem("token"));
  const navigate = useNavigate();
  const [updateConversionbtn, setupdateConverisonbtn] = useState(false);
  const [conversions, setConversions] = useState(conversionRate);
  const [programName, setProgramName] = useState(program);
  const [storeNames, setStores] = useState(stores);
  const [partners, setPartners] = useState(["Nike", "Adidas"]);

  const [stats, setStats] = useState({
    internalPointsRecieved: 0,
    externalPointsRecieved: 0,
    internalPointsRedeemed: 0,
    externalPointsRedeemed: 0,
  });
  async function updateConversion() {
    // submit conversions
    setupdateConverisonbtn(false);
  }

  async function leaveProgram() {
    navigate("/");
  }
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  async function fetchStats() {
    console.log(
      API_LINK +
        "fetchStats/?token=" +
        localStorage.getItem("token") +
        "&program=" +
        partnerid +
        "&storeId=" +
        storeId
    );
    const response = await fetch(
      API_LINK +
        "fetchStats/?token=" +
        localStorage.getItem("token") +
        "&program=" +
        partnerid +
        "&storeId=" +
        storeId
    );

    const ret = await response.json();

    const newStats = {
      internalPointsRecieved: ret.InternalPointsRecieved,
      externalPointsRecieved: ret.ExternalPointsRecieved,
      internalPointsRedeemed: ret.InternalPointsRedeemed,
      externalPointsRedeemed: ret.ExternalPointsRedeemed,
    };
    console.log(newStats);

    setConversions(ret.conversionRate);
    setStats(newStats);
  }

  useEffect(() => {
    console.log("ret");
    // Update the document title using the browser API
    fetchStats();
  });

  const conversion = () => {
    if (updateConversionbtn) {
      return (
        <Container maxWidth="md" alignItems="center" justifyContent="center">
          <Stack direction="row" justifyContent="center" alignItems="center">
            <Paper elevation={1} sx={{ width: "50rem", p: 4, m: 2 }}>
              <Typography variant="h3">
                Set the conversion rate of external stores point to your
                external points
              </Typography>
              <Stack
                direction="row"
                justifyContent="center"
                alignItems="center"
              >
                Every{" "}
                <TextField
                  sx={{ width: "5rem", height: "3rem", ml: 3, mr: 3 }}
                  id="outlined-number"
                  type="number"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  onChange={(e) => {
                    setConversions(e.target.value);
                  }}
                  defaultValue={conversions}
                ></TextField>{" "}
                points from partner stores is equivalent to 1 external point
              </Stack>
              <ActionButton
                variant="contained"
                color="secondary"
                onClick={() => {
                  updateConversion();
                }}
              >
                Apply conversion
              </ActionButton>
            </Paper>
          </Stack>
        </Container>
      );
    } else {
      return;
    }
  };

  return (
    <Container maxWidth="800px">
      <Stack direction="row" justifyContent="flex-end">
        <Button
          onClick={() => {
            setupdateConverisonbtn(!updateConversionbtn);
          }}
        >
          Points Conversion
        </Button>
        <Button
          onClick={() => {
            leaveProgram();
          }}
        >
          Leave Partner Program
        </Button>
      </Stack>

      <Typography variant="h1">{programName}</Typography>
      {conversion()}
      <Typography variant="h2">Loyalty Stats</Typography>

      <Container alignItems="center" justifyContent="center">
        <Box
          sx={{
            m: 2,
            width: "100%",
          }}
        >
          <Stack
            direction="row"
            flexWrap="wrap"
            alignItems="center"
            justifyContent="center"
          >
            <Tile
              title={"Instore Points Added"}
              count={stats.internalPointsRecieved}
            />
            <Tile
              title={"Instore Points Redeemed"}
              count={stats.internalPointsRedeemed}
            />
            <Tile
              title={"External Points Added"}
              count={stats.externalPointsRecieved}
            />
            <Tile
              title={"External Points Redeemed"}
              count={stats.externalPointsRedeemed}
            />
          </Stack>
        </Box>
        <Typography variant="h2">Participating Partners</Typography>
        <Stack direction="row" sx={{ m: 3, p: 2 }} flexWrap="wrap">
          {storeNames.map((partner) => {
            return <Label title={partner}></Label>;
          })}
        </Stack>

        <div>
          <Button variant="contained" size="large" onClick={handleClickOpen}>
            Invite A Store
          </Button>
          <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {"Invite a Store"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                To invite another store to your partner program the store needs
                to put the following program id when they are setting up their
                account.
              </DialogContentText>
              <Container sx={{ mt: 2, pt: 2 }}>
                <Typography variant="p" sx={{ color: "gray" }}>
                  A partner program can have up to 5 partners and you can only
                  have one active partner program
                </Typography>
              </Container>
              <Container sx={{ m: 2, p: 2 }}>
                <Typography variant="h2">{partnerid}</Typography>
              </Container>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} autoFocus>
                Close
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </Container>
    </Container>
  );
}
