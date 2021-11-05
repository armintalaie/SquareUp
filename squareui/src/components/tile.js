import { Button, Paper, Container, Box } from "@mui/material";

export default function Tile(props) {
  const title = props.title ? props.title : "Customers";
  const count = props.count ? props.count : "Customers";

  return (
    <Paper elevation={3} sx={{ width: "10rem", height: "10rem", p: 2, m: 2 }}>
      <h4>{title}</h4>
      <Button sx={{ p: 2, border: "1px dashed grey" }}>Save</Button>
    </Paper>
  );
}
