import { Paper, Container, Box, Typography, Stack } from "@mui/material";
import { ActionButton } from "../theme";
import { useEffect, useState } from "react";
import { theme } from "../App";
import * as Constants from "../constants/URL";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Client } from "square";

export default function Setup(props) {
  const navigate = useNavigate();
  const search = useLocation().search;
  const name = new URLSearchParams(search).get("code");

  let token = "ss";

  useEffect(() => {
    if (name) {
      authorize();
    }
  }, []);

  const [form, setForm] = useState("");
  // const [env, setEnv] = useState("sandbox");

  const scope = [
    "CUSTOMERS_WRITE",
    "CUSTOMERS_READ",
    "MERCHANT_PROFILE_READ",
    "MERCHANT_PROFILE_WRITE",
    "LOYALTY_WRITE",
    "LOYALTY_READ",
  ];
  const CLIENT_ID_2 = "sandbox-sq0idb-VJnyyzDH0JqdQMHHRvtZKQ";
  const authURL =
    "https://connect.squareupsandbox.com/oauth2/authorize?client_id=" +
    CLIENT_ID_2 +
    "&scope=" +
    scope.join("+") +
    "&session=False&state=82201dd8d83d23cc8a48caf52b";

  async function authorize() {
    //const client = new Client();

    try {
      const resp = await fetch(
        "https://us-central1-square-4797a.cloudfunctions.net/authorize/?code=" +
          name
      );
      const result = await resp.json();
      console.log(result);
      if (resp.status === 200) {
        token = result.token;
        localStorage.setItem("token", token);
        navigate("setup");
        return true;
      }

      return false;
    } catch (e) {
      console.log(e);
    }
  }

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
          </ActionButton>
        </a>
      </Container>{" "}
    </div>
  );
}
