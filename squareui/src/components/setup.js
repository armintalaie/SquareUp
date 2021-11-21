import { Container, Box, Typography, useThemeProps } from "@mui/material";
import { ActionButton, FieldForm } from "../theme";
import { useState } from "react";
import { theme } from "../App";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function Setup(props) {
  console.log(localStorage.getItem("token"));
  const [form, setForm] = useState("");
  const CHOICES = { UNDECLARED: "undeclared", CREATE: "create", JOIN: "join" };
  const [choice, setChoice] = useState(CHOICES.UNDECLARED);
  const API_LINK = "https://us-central1-square-4797a.cloudfunctions.net/";

  const onTextChange = (e) => {
    setForm(e.target.value);
  };

  async function joinProgram() {
    try {
      console.log("join  + ");
      const response = await fetch(
        API_LINK +
          "joinPartnerProgram/?token=" +
          localStorage.getItem("token") +
          "&program=" +
          form
      );
      const ret = await response.json();
      useThemeProps.updateIds(ret.partnerid, ret.storeId, true);
    } catch (e) {
      console.log(e);
    }
  }

  async function createProgram() {
    try {
      console.log("create  + ");
      const response = await fetch(
        API_LINK +
          "createPartnerProgram/?token=" +
          localStorage.getItem("token") +
          "&program=" +
          form
      );
      const ret = await response.json();
      useThemeProps.updateIds(ret.partnerid, ret.storeId, true);
    } catch (e) {
      console.log(e);
    }
  }

  async function triggerPartners() {
    console.log(`triggerPartners via ${choice}`);
    switch (choice) {
      case CHOICES.CREATE:
        createProgram().then((res) => {
          // navigate("/dashboard");
        });
        return;
      case CHOICES.JOIN:
        joinProgram().then((res) => {});
        return;
      default:
        console.error(
          "Shoould not attempt to trigger program call without specified action"
        );
        return;
    }
  }

  const backButton = () => {
    return (
      <ArrowBackIcon
        color="primary"
        fontSize="large"
        onClick={() => {
          setChoice(CHOICES.UNDECLARED);
        }}
      />
    );
  };

  function setupCondition() {
    switch (choice) {
      case CHOICES.CREATE:
        return (
          <Box m={1} p={1}>
            <Typography variant="h2" style={{ textAlign: "left" }}>
              Create A Partner Loyalty Program{" "}
            </Typography>{" "}
            <Box
              display="flex"
              justify="flex-start"
              alignItems="center"
              flexDirection="row"
            >
              {backButton()}
              <FieldForm
                id="outlined-basic"
                label="Program Name"
                variant="outlined"
                fullWidth
                onChange={onTextChange}
                value={form}
              />{" "}
              <ActionButton
                variant="contained"
                onClick={() => triggerPartners()}
              >
                Create{" "}
              </ActionButton>{" "}
            </Box>{" "}
          </Box>
        );
      case CHOICES.JOIN:
        return (
          <Box m={1} p={1}>
            <Typography variant="h2" style={{ textAlign: "left" }}>
              Join A Partner Loyalty Program{" "}
            </Typography>{" "}
            <Box
              display="flex"
              justify="flex-start"
              alignItems="center"
              flexDirection="row"
            >
              {backButton()}
              <FieldForm
                id="outlined-basic"
                label="Program ID"
                variant="outlined"
                onChange={onTextChange}
                value={form}
                fullWidth
              />
              <ActionButton
                variant="contained"
                onClick={() => triggerPartners()}
              >
                Join{" "}
              </ActionButton>{" "}
            </Box>{" "}
          </Box>
        );
      default:
        return (
          <Container maxWidth="md" m={1} p={1} sx={{ mt: 4 }}>
            <Typography variant="h6">
              Do you want to create a joint partner loyalty program or join an
              exisiting one{" "}
            </Typography>
            <ActionButton
              variant="contained"
              onClick={() => setChoice(CHOICES.CREATE)}
            >
              Create{" "}
            </ActionButton>{" "}
            <ActionButton
              variant="contained"
              onClick={() => setChoice(CHOICES.JOIN)}
            >
              Join{" "}
            </ActionButton>{" "}
          </Container>
        );
    }
  }

  return (
    <div>
      <Container maxWidth="lg" className={theme.root}>
        <Container maxWidth="md">{setupCondition()} </Container>{" "}
      </Container>{" "}
    </div>
  );
}
