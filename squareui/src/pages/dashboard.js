import Grid from "@mui/material/Grid";
import { Button, Paper, Container, Box } from "@mui/material";
import { styled, createTheme, ThemeProvider } from "@mui/system";
import Tile from "../components/tile";
import { useState } from "react";

export default function Dashaboard() {
  const [filter, setFiler] = useState("Internal");

  return (
    <Container>
      <Box textAlign={"left"}>
        <h1>Dashboard</h1>
      </Box>

      <Box textAlign={"left"}>
        <h3>Filter</h3>
        <ul>
          <li>Internal</li>
          <li>External</li>
          <li>Shared</li>
          <li>Total</li>
          <li>All</li>
        </ul>
      </Box>
      <Container alignItems="center" justifyContent="center">
        <Box>
          <Grid container spacing={1}>
            <Grid item xs={3}>
              <Tile title={filter + " Customers"} />
            </Grid>
            <Grid item xs={3}>
              <Tile title={"Average " + filter + " Customer points "} />
            </Grid>
            <Grid item xs={3}>
              <Tile title={"Average " + filter + " Customer redeemed points"} />
            </Grid>
            <Grid item xs={3}>
              <Tile title={filter + " Customers"} />
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Container>
  );
}
