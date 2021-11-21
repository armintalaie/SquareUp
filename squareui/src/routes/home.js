import { Paper, Container, Box, Typography, Stack } from "@mui/material";
import { ActionButton } from "../theme";
import { useEffect, useState } from "react";
import { theme } from "../App";
import { useLocation } from "react-router-dom";
import Setup from "../components/setup";
import Dashboard from "../components/dashboard";

export default function Home() {
  const [hasAccessToLoyalyProgram, setAccess] = useState(false);
  const [programId, setProgramId] = useState(undefined);
  const [storeId, setStoreId] = useState(undefined);

  function updateIds(programId, storeId, canShowDashboard) {
    setStoreId(storeId);
    setProgramId(programId);
    setAccess(canShowDashboard);
  }

  const showDashboard = () => {
    if (hasAccessToLoyalyProgram)
      return (
        <Dashboard
          programId={programId}
          storeId={storeId}
          updateIds={updateIds}
        />
      );
    else return <HomePage updateIds={updateIds} />;
  };
  return <div>{showDashboard()}</div>;
}

function HomePage(props) {
  const search = useLocation().search;
  const name = new URLSearchParams(search).get("code");
  const [authorized, setAuthorized] = useState(false);
  let token = "";

  useEffect(() => {
    if (name) {
      authorize();
      return;
    }
  }, []);

  const scope = [
    "CUSTOMERS_WRITE",
    "CUSTOMERS_READ",
    "MERCHANT_PROFILE_READ",
    "MERCHANT_PROFILE_WRITE",
    "LOYALTY_WRITE",
    "LOYALTY_READ",
  ];
  const CLIENT_ID = "sandbox-sq0idb-VJnyyzDH0JqdQMHHRvtZKQ";
  const authURL =
    "https://connect.squareupsandbox.com/oauth2/authorize?client_id=" +
    CLIENT_ID +
    "&scope=" +
    scope.join("+") +
    "&session=False&state=82201dd8d83d23cc8a48caf52b";

  async function authorize() {
    try {
      const resp = await fetch(
        "https://us-central1-square-4797a.cloudfunctions.net/authorize/?code=" +
          name
      );
      const result = await resp.json();
      if (resp.status === 200) {
        token = result.token;
        localStorage.setItem("token", token);
        setAuthorized(true);
      } else {
        setAuthorized(false);
      }
    } catch (e) {
      console.log(e);
    }
  }

  function option() {
    if (authorized) {
      return <Setup updateIds={props.updateIds} />;
    } else {
      return (
        <a href={authURL}>
          <ActionButton
            variant="contained"
            size="large"
            color="secondary"
            onClick={() => {}}
            sx={{ p: 2, pl: 6, pr: 6, fontSize: 18, m: 2 }}
          >
            Integrate with Square{" "}
          </ActionButton>
        </a>
      );
    }
  }

  return (
    <Container maxWidth="lg" className={theme.root}>
      <Typography variant="h1"> Circle </Typography>
      <Container maxWidth="lg">
        <Paper elevation={0.3} sx={{ bgcolor: "#F6F6F4" }}>
          <Box m={3} p={3} pb={2} pt={2} textAlign={"center"}>
            <Typography variant="h2" sx={{ color: "#4A6D7C", fontSize: 24 }}>
              Partner with other Square stores to take your loyalty programs to
              a new level{" "}
            </Typography>{" "}
          </Box>{" "}
        </Paper>
        <Stack direction="row" flexWrap="wrap" justifyContent="space-between">
          <Paper
            elevation={1}
            sx={{ m: 2, p: 2, ml: 0, bgcolor: "#EEEDE8", maxWidth: "30rem" }}
            flex={1}
          >
            <Box m={2} ml={0} mr={0} p={3} pb={1} pt={1} textAlign={"left"}>
              <Typography variant="h3"> How it works </Typography>
              <Typography variant="h5">
                {" "}
                You can create or join a{" "}
                <span style={{ fontWeight: "bold" }}>Partner Program</span>, a
                collection of Square sellers.
              </Typography>{" "}
              <Typography variant="h5">
                {" "}
                Every time a customer accumulates points or redeems a reward in
                any of the parterning stores, it will reflect in all of the
                stores
              </Typography>{" "}
            </Box>{" "}
          </Paper>{" "}
          <Paper
            elevation={1}
            sx={{ m: 2, p: 2, mr: 0, bgcolor: "#EEEDE8", maxWidth: "30rem" }}
            flex={1}
          >
            <Box
              m={2}
              ml={0}
              mr={0}
              p={3}
              pb={1}
              pt={1}
              textAlign={"left"}
              sx={{ maxWidth: "50rem" }}
            >
              <Typography variant="h3">
                {" "}
                How it can help your business{" "}
              </Typography>
              <Typography variant="h5">
                <ul style={{ padding: 0, margin: 0 }}>
                  <li
                    style={{
                      listStyle: "none",
                      padding: 0,
                      marginBottom: "1rem",
                    }}
                  >
                    Give more options to your customers to use their points
                  </li>
                  <li
                    style={{
                      listStyle: "none",
                      padding: 0,
                      marginBottom: "1rem",
                    }}
                  >
                    Build a more intricate customer relationship via multiple
                    stores
                  </li>
                  <li
                    style={{
                      listStyle: "none",
                      padding: 0,
                      marginBottom: "1rem",
                    }}
                  >
                    Bring in more traffic by incentivizing shared loyalty
                    programs
                  </li>
                </ul>{" "}
                Partner with other Square stores to take your loyalty programs
                to a new level{" "}
              </Typography>{" "}
            </Box>{" "}
          </Paper>{" "}
        </Stack>{" "}
      </Container>

      {option()}
    </Container>
  );
}
