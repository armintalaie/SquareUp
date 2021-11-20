import { Paper, Container, Box, Typography, Stack } from "@mui/material";
import { ActionButton, FieldForm } from "../theme";
import { useState } from "react";
import { theme } from "../App";
import * as Constants from "../constants/URL";
import { useNavigate } from "react-router";

export default function Setup() {
  console.log(localStorage.getItem("token"));
  const navigate = useNavigate();
  const [form, setForm] = useState("");
  const CHOICES = { UNDECLARED: "undeclared", CREATE: "create", JOIN: "join" };
  const [choice, setChoice] = useState(CHOICES.UNDECLARED);
  const API_LINK = "https://us-central1-square-4797a.cloudfunctions.net/";

  const onTextChange = (e) => {
    setForm(e.target.value);
  };

  async function joinProgram() {
    //TODO: join program
    try {
      console.log("join  + " + localStorage.getItem("token"));
      const response = await fetch(
        API_LINK +
          "joinPartnerProgram/?token=" +
          localStorage.getItem("token") +
          "&program=" +
          form
      );
      console.log(response);
      const ret = await response.json();
      console.log(ret.stores);
      navigate("/dashboard", {
        state: {
          program: ret.program,
          stores: ret.stores,
          partnerid: ret.partnerid,
          storeId: ret.storeId,
          conversationRate: ret.conversionRate,
        },
      });
      console.log(ret);
    } catch (e) {
      console.log(e);
    }
  }

  async function createProgram() {
    //TODO: create program
    try {
      console.log("create  + " + localStorage.getItem("token"));
      const response = await fetch(
        API_LINK +
          "createPartnerProgram/?token=" +
          localStorage.getItem("token") +
          "&program=" +
          form
      );
      console.log(response);
      const ret = await response.json();
      navigate("/dashboard", {
        state: {
          program: ret.program,
          stores: ret.stores,
          partnerid: ret.partnerid,
          storeId: ret.storeId,
          conversationRate: ret.conversionRate,
        },
      });
      console.log(ret);
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
              alignItems="flex-start"
              flexDirection="row"
            >
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
              alignItems="flex-start"
              flexDirection="row"
            >
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
        <Typography variant="h1"> Square Partners Program </Typography>
        <h4> {form} </h4>{" "}
        <Container maxWidth="md">
          <Stack direction="row">
            <Paper elevation={1} sx={{ m: 2, p: 3, ml: 0, bgcolor: "#F8F4DD" }}>
              <Box m={3} ml={0} mr={0} p={1} textAlign={"left"}>
                <Typography variant="h3"> How it works </Typography>
                <Typography variant="h5">
                  {" "}
                  Partner with other Square stores to take your loyalty programs
                  to a new leveleewng; lwgmnw; lgnw; lkgn;{" "}
                </Typography>{" "}
              </Box>{" "}
            </Paper>{" "}
            <Paper elevation={1} sx={{ m: 2, p: 3, mr: 0, bgcolor: "#F8F4DD" }}>
              <Box m={3} ml={0} mr={0} p={1} textAlign={"left"}>
                <Typography variant="h3"> How it works </Typography>
                <Typography variant="h5">
                  {" "}
                  Partner with other Square stores to take your loyalty programs
                  to a new level{" "}
                </Typography>{" "}
              </Box>{" "}
            </Paper>{" "}
          </Stack>{" "}
          {setupCondition()}{" "}
        </Container>{" "}
      </Container>{" "}
    </div>
  );
}
