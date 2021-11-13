import {
  Button,
  Paper,
  Container,
  Box,
  Stack,
  Typography,
  TextField,
} from "@mui/material";
import Tile from "../components/tile";
import Label from "../components/label";
import { useState } from "react";
import { ActionButton } from "../theme";
import { useNavigate } from "react-router";

export default function Dashaboard(props) {
  const navigate = useNavigate();
  const [updateConversionbtn, setupdateConverisonbtn] = useState(false);
  const [conversions, setConversions] = useState([3, 4]);
  const [programName, setProgramName] = useState(
    props.program ? props.program : "PC Optimum"
  );
  const [partners, setPartners] = useState(["Nike", "Adidas"]);
  async function updateConversion() {
    setupdateConverisonbtn(false);
  }

  async function leaveProgram() {
    navigate("/");
  }

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
          {partners.map((partner) => {
            return <Label title={partner}></Label>;
          })}
        </Stack>
      </Container>
    </Container>
  );
}
