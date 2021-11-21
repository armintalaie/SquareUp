import {
  Button,
  Paper,
  Container,
  Box,
  Stack,
  Typography,
  TextField,
  Divider,
} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Tile from "./tile";
import Label from "./label";
import { useEffect, useState } from "react";
import { ActionButton } from "../theme";
import HelpIcon from "@mui/icons-material/Help";
import Loading from "./loading";
const API_LINK = "https://us-central1-square-4797a.cloudfunctions.net/";

export default function Dashboard(props) {
  const [isLoading, setLoading] = useState(true);
  const MAX_COUNT = 5;
  const [open, setOpen] = useState(false);
  const [wantToLeave, setWantToleave] = useState(false);
  const programId = props.programId ? props.programId : "MISSING PROGRAM ID";
  const storeId = props.storeId ? props.storeId : "MISSING STORE ID";
  const [updateConversionbtn, setupdateConverisonbtn] = useState(false);
  const [conversions, setConversions] = useState(1);
  const [programName, setProgramName] = useState("Partner Program");
  const [storeNames, setStores] = useState(["Store 1", "Store 2"]);
  const [stats, setStats] = useState({
    internalPointsRecieved: 0,
    externalPointsRecieved: 0,
    internalPointsRedeemed: 0,
    externalPointsRedeemed: 0,
  });

  const needsLoader = () => {
    if (isLoading) {
      return <Loading />;
    } else {
      return <div></div>;
    }
  };

  async function updateConversion() {
    setupdateConverisonbtn(false);
    try {
      const response = await fetch(
        API_LINK +
          "updateConversion/?token=" +
          localStorage.getItem("token") +
          "&program=" +
          programId +
          "&storeId=" +
          storeId +
          "&conversion=" +
          conversions
      );
      // setupdateConverisonbtn(false);
    } catch (e) {}
  }

  async function leavePartnerProgram() {
    setLoading(true);
    try {
      const response = await fetch(
        API_LINK +
          "leavePartnerProgram/?token=" +
          localStorage.getItem("token") +
          "&program=" +
          programId +
          "&storeId=" +
          storeId
      );
      const ret = await response.json();
      localStorage.removeItem("token");
      setLoading(false);
      props.updateIds("programId", "storeId", false);
    } catch (e) {
      setLoading(false);
      props.updateIds("programId", "storeId", false);
    }
  }

  const showInvite = () => {
    if (storeNames.length >= MAX_COUNT) {
      return <div></div>;
    } else {
      return (
        <div onClick={handleClickOpen}>
          <Label title="invite" isStore={false}></Label>
        </div>
      );
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  async function fetchStats() {
    try {
      const response = await fetch(
        API_LINK +
          "fetchStats/?token=" +
          localStorage.getItem("token") +
          "&program=" +
          programId +
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

      setConversions(ret.conversionRate);
      setStats(newStats);
    } catch (e) {}
  }

  async function fetchStores() {
    try {
      const response = await fetch(
        API_LINK +
          "fetchStores/?token=" +
          localStorage.getItem("token") +
          "&program=" +
          programId +
          "&storeId=" +
          storeId
      );
      const ret = await response.json();
      setStores(ret.stores);
      setProgramName(ret.programName);
      setLoading(false);
    } catch (e) {}
  }

  useEffect(() => {
    fetchStats().then((res) => {
      fetchStores();
    });
  }, []);

  const conversion = () => {
    if (updateConversionbtn) {
      return (
        <Container maxWidth="md" alignItems="center" justifyContent="center">
          <Divider sx={{ m: 3 }} />
          <Stack direction="row" justifyContent="center" alignItems="center">
            <Paper
              elevation={0}
              sx={{ width: "50rem", p: 4, m: 2, borderRadius: 5 }}
            >
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
                  InputProps={{ inputProps: { min: 1 }, shrink: true }}
                  type="number"
                  onChange={(e) => {
                    setConversions(e.target.value);
                  }}
                  defaultValue={conversions}
                ></TextField>{" "}
                points from partner stores is equivalent to 1 external point
              </Stack>
              <ActionButton
                variant="contained"
                color="primary"
                onClick={() => {
                  updateConversion();
                }}
              >
                Apply conversion
              </ActionButton>
            </Paper>
          </Stack>
          <Divider sx={{ m: 3 }} />
        </Container>
      );
    } else {
      return;
    }
  };

  return (
    <Container maxWidth="800px">
      {needsLoader()}
      <Stack direction="row" justifyContent="flex-end">
        <Button
          onClick={() => {
            setupdateConverisonbtn(!updateConversionbtn);
          }}
        >
          Points Conversion
        </Button>
        <Button onClick={() => setWantToleave(true)}>
          Leave Partner Program
        </Button>
      </Stack>

      <Typography variant="h1">{programName}</Typography>
      {conversion()}
      <Stack flexDirection="row" alignItems="center" justifyContent="center">
        <Typography variant="h2">Loyalty Points</Typography>
        <Help title="Loyalty Point Types" description=""></Help>
      </Stack>

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
        <Divider sx={{ m: 10 }} />
        <Typography variant="h2">Circle of Partners</Typography>
        <Stack direction="row" sx={{ m: 3, p: 2 }} flexWrap="wrap">
          {storeNames.map((partner) => {
            return <Label title={partner} isStore={true}></Label>;
          })}
          {showInvite()}
        </Stack>

        <div>
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
                <Typography variant="h2">{programId}</Typography>
              </Container>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} autoFocus>
                Close
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog
            open={wantToLeave}
            onClose={() => setWantToleave(true)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">{"Leave Program"}</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Are you sure you want to leave {programName} and delete your
                account?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setWantToleave(false)}>No</Button>
              <Button
                onClick={() => {
                  leavePartnerProgram();
                }}
                autoFocus
              >
                Yes
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </Container>
    </Container>
  );
}

function Help({ title, description }) {
  const [open, setOpen] = useState(false);

  const dialog = () => {
    return (
      <Dialog
        open={open}
        onClose={() => setOpen(true)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Loyalty Point Types</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Typography variant="h5">
              <span style={{ fontWeight: "bold", paddingRight: "0.5rem" }}>
                Instore:{" "}
              </span>{" "}
              points that are either awarded or redeemed through your store. For
              example, when a customer buys something at your store
            </Typography>
            <Typography variant="h5">
              <span style={{ fontWeight: "bold", paddingRight: "0.5rem" }}>
                External:{" "}
              </span>{" "}
              points that are converted from either awarded or redeemed point
              from partner stores; You can change the external conversion
              points.
            </Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    );
  };

  return (
    <div>
      <HelpIcon onClick={() => setOpen(true)}></HelpIcon>
      {dialog()}
    </div>
  );
}
