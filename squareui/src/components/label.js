import { Typography, Paper } from "@mui/material";
import { ActionButton } from "../theme";

export default function Label({ title, isStore }) {
  if (isStore) {
    return (
      <Paper elevation={2} sx={{ m: 1, p: 1, pl: 3, pr: 3, borderRadius: 4 }}>
        <Typography variant="h2">{title} </Typography>
      </Paper>
    );
  } else {
    return (
      <ActionButton
        variant="contained"
        elevation={2}
        sx={{ m: 1, p: 1, pl: 1, pr: 1, borderRadius: 4 }}
      >
        <Typography variant="h2">{title} </Typography>
      </ActionButton>
    );
  }
}
