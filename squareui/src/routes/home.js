import { Paper, Container, Box, Typography, Stack } from "@mui/material";
import { ActionButton } from "../theme";
import { useState } from "react";
import { theme } from "../App";
import * as Constants from "../constants/URL";
import { useNavigate, Link } from "react-router-dom";
import { Client } from "square";
export default function Setup() {
  const [form, setForm] = useState("");
  const [accessToken, setaccessToken] = useState("");
  // const [env, setEnv] = useState("sandbox");
  const [authStatus, setAuthStatus] = useState(false);
  const scope = [
    "CUSTOMERS_WRITE",
    "CUSTOMERS_READ",
    "MERCHANT_PROFILE_READ",
    "MERCHANT_PROFILE_WRITE",
    "LOYALTY_WRITE",
    "LOYALTY_READ",
  ];
  const authURL =
    "https://connect.squareup.com/oauth2/authorize?client_id=sq0idp-gmMyNcJXp6Zhwkc342U_6Q&scope=" +
    scope.join("+") +
    "&session=False&state=82201dd8d83d23cc8a48caf52b";
  const navigate = useNavigate();

  const routeChange = () => {
    let path = `setup`;
    navigate(path);
  };

  async function authorize() {
    const client = new Client();

    // TODO: send request
    // if (!authStatus) {
    //   routeChange();
    // } else {
    //   alert("something went wrong try again plase");
    // }
  }

  //   async function storeInfo() {
  //     const requestOptions = {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ accessToken: accessToken }),
  //     };
  //     const res = await fetch(Constants.API.SERVER_URL, requestOptions);
  //     setAuthStatus(true);
  //   }
  return (
    <div>
      <Container maxWidth="lg" className={theme.root}>
        <Typography variant="h1"> Square Partners Program </Typography>
        <h4> {form} </h4>{" "}
        <Container maxWidth="md">
          <Paper elevation={1}>
            <Box m={3} p={3} pb={5} pt={5} textAlign={"left"}>
              <Typography variant="h5">
                Partner with other Square stores to take your loyalty programs
                to a new level{" "}
              </Typography>{" "}
              <Typography variant="h5">
                Give your loyal customers more options by expanding your loyalty
                program to include more partenring stores{" "}
              </Typography>{" "}
            </Box>{" "}
          </Paper>
          <Stack direction="row">
            <Paper elevation={1} sx={{ m: 4, p: 3, ml: 0, bgcolor: "#F8F4DD" }}>
              <Box m={3} ml={0} mr={0} p={1} textAlign={"left"}>
                <Typography variant="h3"> How it works </Typography>
                <Typography variant="h5">
                  {" "}
                  Partner with other Square stores to take your loyalty programs
                  to a new level{" "}
                </Typography>{" "}
                <Typography variant="h5">
                  {" "}
                  Give your loyal customers more options by expanding your
                  loyalty program to include more partenring stores{" "}
                </Typography>{" "}
              </Box>{" "}
            </Paper>{" "}
            <Paper elevation={1} sx={{ m: 4, p: 3, mr: 0, bgcolor: "#F8F4DD" }}>
              <Box m={3} ml={0} mr={0} p={1} textAlign={"left"}>
                <Typography variant="h3"> How it works </Typography>
                <Typography variant="h5">
                  {" "}
                  Partner with other Square stores to take your loyalty programs
                  to a new level{" "}
                </Typography>{" "}
                <Typography variant="h5">
                  {" "}
                  Give your loyal customers more options by expanding your
                  loyalty program to include more partenring stores{" "}
                </Typography>{" "}
              </Box>{" "}
            </Paper>{" "}
          </Stack>{" "}
        </Container>
        <a href={authURL}>
          <ActionButton
            variant="contained"
            size="large"
            color="secondary"
            onClick={() => {}}
            sx={{ p: 2, pl: 4, pr: 4, fontSize: 18, m: 4 }}
          >
            Integrate with Square{" "}
          </ActionButton>{" "}
        </a>
      </Container>{" "}
    </div>
  );
}
