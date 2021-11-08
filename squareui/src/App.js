import "./App.css";
import { createTheme, ThemeProvider } from "@mui/material";
import Typography from "@mui/material/Typography";
import "@fontsource/roboto";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Setup from "./routes/setup";

const font = "Poppins";

export const theme = createTheme({
  typography: {
    fontFamily: [font].join(","),
    h1: {
      color: "#233d3a",
      padding: 10,
      margin: 10,
      marginBottom: 50,
      fontWeight: "bold",
      fontSize: 30,
      width: "100%",
      textAlign: "center",
    },
    h2: {
      padding: 2,
      margin: 2,
      fontWeight: "bold",
      fontSize: 20,
    },
  },
  palette: {
    primary: { main: "#1789FC" },
  },
  root: {
    backgroundColor: "red",
  },
});

function App() {
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <Routes>
            <Route path="/setup" element={<Setup />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </div>
  );
}

export default App;
