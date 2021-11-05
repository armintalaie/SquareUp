import {
  Button,
  Paper,
  Container,
  Box,
  TextField,
  Typography,
  Alert,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { ActionButton, FieldForm } from "../theme";
import { useState } from "react";

export default function Setup() {
  const [form, setForm] = useState("");

  const onTextChange = (e) => {
    setForm(e.target.value);
  };

  function triggerPartners(type) {
    if (type === "Create") {
      alert(form);
    } else {
    }
  }
  return (
    <Container maxWidth="lg">
      <Typography variant="h1">Square Partners Program</Typography>

      <h4>{form}</h4>
      <Container maxWidth="md">
        <Paper elevation={2}>
          <Box m={3} p={5} textAlign={"left"}>
            <h4>
              Partner with other Square stores to take your loyalty programs to
              a new level
            </h4>
            <h4>
              Give your loyal customers more options by expanding your loyalty
              program to include more partenring stores
            </h4>
          </Box>
        </Paper>

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
  );
}
