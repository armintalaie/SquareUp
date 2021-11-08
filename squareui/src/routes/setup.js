import { Button, Paper, Container, Box, Typography } from "@mui/material";
import { ActionButton, FieldForm } from "../theme";
import { useState } from "react";
import { theme } from "../App";

export default function Setup() {
  const [form, setForm] = useState("");
  const [accessToken, setaccessToken] = useState("");
  const [env, setEnv] = useState("sandbox");
  const [authStatus, setAuthStatus] = useState(false);

  const onTextChange = (e) => {
    setForm(e.target.value);
  };

  function triggerPartners(type) {
    if (type === "Create") {
      alert(form);
    } else {
    }
  }

  function storeInfo() {
    setAuthStatus(true);
  }
  return (
    <div>
      <Container maxWidth="lg" className={theme.root}>
        <Typography variant="h1">Square Partners Program</Typography>

        <h4>{form}</h4>
        <Container maxWidth="md">
          <Paper elevation={2}>
            <Box m={3} p={5} textAlign={"left"}>
              <h4>
                Partner with other Square stores to take your loyalty programs
                to a new level
              </h4>
              <h4>
                Give your loyal customers more options by expanding your loyalty
                program to include more partenring stores
              </h4>
            </Box>
          </Paper>

          <Box m={1} p={1}>
            <Typography variant="h2" style={{ textAlign: "left" }}>
              Enter your account info
            </Typography>
            <Box
              display="flex"
              justify="flex-start"
              alignItems="flex-start"
              flexDirection="row"
            >
              <FieldForm
                disabled={authStatus}
                color="secondary"
                id="outlined-basic"
                label="Access Token"
                variant="outlined"
                fullWidth
                onChange={(e) => {
                  setaccessToken(e.target.value);
                }}
                value={accessToken}
              />
              <FieldForm
                disabled={authStatus}
                color="secondary"
                id="outlined-basic"
                label="Environment"
                variant="outlined"
                fullWidth
                onChange={(e) => {
                  setEnv(e.target.value);
                }}
                value={env}
              />
              <ActionButton
                disabled={authStatus}
                variant="contained"
                onClick={() => storeInfo()}
              >
                Authorize access
              </ActionButton>
            </Box>
          </Box>

          <Box m={1} p={1}>
            <Typography variant="h2" style={{ textAlign: "left" }}>
              Create A Partner Loyalty Program
            </Typography>
            <Box
              display="flex"
              justify="flex-start"
              alignItems="flex-start"
              flexDirection="row"
            >
              <FieldForm
                color="secondary"
                id="outlined-basic"
                label="Program Name"
                variant="outlined"
                fullWidth
                onChange={onTextChange}
                value={form}
              />
              <ActionButton
                variant="contained"
                onClick={() => triggerPartners("Create")}
              >
                Create
              </ActionButton>
            </Box>
          </Box>
          <Box m={1} p={1}>
            <Typography variant="h2" style={{ textAlign: "left" }}>
              Join A Partner Loyalty Program
            </Typography>
            <Box
              display="flex"
              justify="flex-start"
              alignItems="flex-start"
              flexDirection="row"
            >
              <FieldForm
                id="outlined-basic"
                label="Program ID"
                variant="outlined"
                color="secondary"
                fullWidth
              />

              <ActionButton variant="contained">Join</ActionButton>
            </Box>
          </Box>
        </Container>
      </Container>
    </div>
  );
}
