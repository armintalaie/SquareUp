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
import { useState } from "react";
import { ActionButton } from "../theme";
import { useNavigate, useLocation } from "react-router";

export default function Dashaboard() {
  const { state } = useLocation();
  const { program, stores, partnerid } =
    state == null
      ? {
          program: "N/A",
          stores: [".....", ".....", ".....", ".....", "....."],
          partnerid: "N/A",
        }
      : state;

  console.log(localStorage.getItem("token"));
  const navigate = useNavigate();
  const [updateConversionbtn, setupdateConverisonbtn] = useState(false);
  const [conversions, setConversions] = useState([3, 4]);
  const [programName, setProgramName] = useState(program);
  const [storeNames, setStores] = useState(stores);
  const [partners, setPartners] = useState(["Nike", "Adidas"]);
  async function updateConversion() {
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

  const conversion = () => {
    if (updateConversionbtn) {
      return (
        <Container maxWidth="md">
          <Typography variant="h5">
            Set conversion of your points to partner stores and vice versa
          </Typography>
          <Stack direction="row" justifyContent="center" alignItems="center">
            <TextField
              id="outlined-number"
              label="Partner points"
              type="number"
              InputLabelProps={{
                shrink: true,
              }}
              onChange={(e) => {
                setConversions([e.target.value, conversions[1]]);
              }}
              defaultValue={conversions[0]}
            ></TextField>

            <Typography variant="h2">=</Typography>

            <TextField
              id="outlined-number"
              label="Your points"
              type="number"
              InputLabelProps={{
                shrink: true,
              }}
              onChange={(e) => {
                setConversions([conversions[0], e.target.value]);
              }}
              defaultValue={conversions[1]}
            ></TextField>
          </Stack>
          <ActionButton
            variant="outlined"
            color="secondary"
            onClick={() => {
              updateConversion();
            }}
          >
            Apply conversion
          </ActionButton>
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
            <Tile title={"Instore Points Added"} count={40} />
            <Tile title={"Instore Points Redeemed"} count={400} />
            <Tile title={"Total Points Added"} count={1240} />
            <Tile title={"Total Points Redeemed"} count={320} />
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
                <Typography variant="h2">
                  8852a6a7-e755-46c3-bd3b-cf3c9f2f6799
                </Typography>
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
