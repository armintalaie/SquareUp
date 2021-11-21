import "./App.css";
import { createTheme, ThemeProvider } from "@mui/material";
import "@fontsource/roboto";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./routes/home";
const font = "Poppins";

export const theme = createTheme({
    paper: {
        color: "#F8F4DD",
    },
    typography: {
        fontFamily: [font].join(","),
        h1: {
            color: "#388FE5",
            padding: 10,
            margin: 10,
            marginBottom: "5rem",
            fontWeight: "bold",
            fontSize: 50,
            width: "100%",
            textAlign: "center",
        },
        h2: {
            padding: 2,
            margin: 5,
            fontWeight: "bold",
            fontSize: 20,
        },
        h3: {
            padding: 0,
            margin: 1,
            paddingLeft: 0,
            marginLeft: 0,
            marginBottom: "1rem",
            fontWeight: "medium",
            fontSize: 18,
        },
        h5: {
            padding: 0,
            margin: 1,
            paddingLeft: 0,
            marginLeft: 0,
            marginBottom: "1rem",
            fontSize: 18,
        },
    },
    palette: {
        primary: {
            main: "#1970C8",
        },
        secondary: {
            main: "#1970C8",
        },
    },
    root: {
        backgroundColor: "red",
    },
});

function App() {
    return ( <
        div className = "App" >
        <
        ThemeProvider theme = { theme } >
        <
        BrowserRouter >
        <
        Routes >
        <
        Route path = "/"
        element = { < Home / > }
        />' <
        /Routes> <
        /BrowserRouter> <
        /ThemeProvider> <
        /div>
    );
}

export default App;