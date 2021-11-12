import { Typography, Paper } from "@mui/material";

export default function Label({ title }) {
  return (
    <Paper elevation={2} sx={{ m: 2, p: 3, pl: 5, pr: 5, borderRadius: 10 }}>
      <Typography variant="h2">{title}</Typography>
    </Paper>
  );
}
