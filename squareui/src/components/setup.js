import { Container, Box, Typography } from "@mui/material";
import { ActionButton, FieldForm } from "../theme";
import { useState } from "react";
import { theme } from "../App";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Loading from "./loading";

export default function Setup(props) {
  const [isLoading, setLoading] = useState(false);
  const [form, setForm] = useState("");
  const CHOICES = { UNDECLARED: "undeclared", CREATE: "create", JOIN: "join" };
  const [choice, setChoice] = useState(CHOICES.UNDECLARED);
  const API_LINK = "https://us-central1-square-4797a.cloudfunctions.net/";

  const onTextChange = (e) => {
    setForm(e.target.value);
  };

  const needsLoader = () => {
    if (isLoading) {
      return <Loading />;
    } else {
      return <div></div>;
    }
  };

  async function joinProgram() {
    try {
      console.log("join");
      const response = await fetch(
        API_LINK +
          "joinPartnerProgram/?token=" +
          localStorage.getItem("token") +
          "&program=" +
          form
      );
      const ret = await response.json();
      localStorage.setItem("programId", ret.programId);
      localStorage.setItem("storeId", ret.storeId);
      props.updateIds(ret.programId, ret.storeId, true);
      setLoading(false);
    } catch (e) {
      console.log(e);
    }
  }

  async function createProgram() {
    try {
      console.log("create");
      const response = await fetch(
        API_LINK +
          "createPartnerProgram/?token=" +
          localStorage.getItem("token") +
          "&program=" +
          form
      );
      const ret = await response.json();
      localStorage.setItem("programId", ret.programId);
      localStorage.setItem("storeId", ret.storeId);
      props.updateIds(ret.programId, ret.storeId, true);
      setLoading(false);
    } catch (e) {
      console.log(e);
    }
  }

  async function triggerPartners() {
    setLoading(true);
    console.log(`triggerPartners via ${choice}`);
    switch (choice) {
      case CHOICES.CREATE:
        createProgram();
        return;
      case CHOICES.JOIN:
        joinProgram();
        return;
      default:
        console.warn(
          "Shoould not attempt to trigger program call without specified action"
        );
        setLoading(false);
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
            {needsLoader()}
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
