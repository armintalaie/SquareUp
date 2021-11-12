import Grid from "@mui/material/Grid";
import {
  Button,
  Paper,
  Container,
  Box,
  Stack,
  Typography,
} from "@mui/material";
import { styled, createTheme, ThemeProvider } from "@mui/system";
import Tile from "../components/tile";
import Label from "../components/label";
import { useState } from "react";

export default function Dashaboard() {
  return (
    <Container maxWidth="800px">
      <Box sx={{ p: 3 }} textAlign={"left"}>
        <h1>Dashboard</h1>
      </Box>

      <Typography variant="h1">PC Optimum</Typography>
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
            <Tile title={"Points Added"} count={40} />
            <Tile title={"Points Redeemed"} count={400} />
            <Tile title={"Points Added"} count={1240} />
            <Tile title={"Points Added"} count={320} />
          </Stack>
        </Box>
        <Typography variant="h2">Participating Partners</Typography>
        <Stack direction="row" sx={{ m: 3, p: 2 }} flexWrap="wrap">
          <Label title="Nike"></Label>
          <Label title="Adidas"></Label>
          <Label title="Fila"></Label>
          <Label title="Vans"></Label>
          <Label title="Converse"></Label>
        </Stack>
      </Container>
    </Container>
  );
}
