import "./App.css";
import Home from "./pages/home";
import Button from "@mui/material/Button";
import Setup from "./pages/setup";
import { createTheme, ThemeProvider } from "@mui/material";
import Typography from "@mui/material/Typography";
import "@fontsource/roboto";

const font = "Poppins";

const theme = createTheme({
  typography: {
    fontFamily: [font].join(","),
    h1: {
      color: "#233d3a",
      padding: 10,
      margin: 10,
      marginBottom: 50,
      fontWeight: "bold",
      fontSize: 30,
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
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <Setup />
        <Home></Home>
      </div>
    </ThemeProvider>
  );
}

export default App;
