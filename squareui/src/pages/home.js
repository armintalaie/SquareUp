import { Button, Paper, Container, Box } from "@mui/material";
import { styled, createTheme, ThemeProvider } from "@mui/system";
import Dashaboard from "./dashboard";

export default function Home() {
  return (
    <div>
      <h1 style={{ margin: "4rem" }}>Square Partnerships</h1>

      <Dashaboard />

      <Container maxWidth="sm">
        <Paper elevation={2}>
          <Box m={3} p={5} textAlign={"left"}>
            <h4>
              partner with other Square stores to take your loyalty programs to
              a new level
            </h4>
            <h4>
              Give your loyal customers more options by expanding your loyalty
              program to include more partenring stores
            </h4>
          </Box>
        </Paper>
      </Container>

      <Button variant="contained" size="large">
        I'm Ready
      </Button>
    </div>
  );
}
