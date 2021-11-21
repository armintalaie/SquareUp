import { Paper, Box, Stack } from "@mui/material";
import Typography from "@mui/material/Typography";

export default function Tile(props) {
  const title = props.title ? props.title : "Customers";

  const count = props.count;

  return (
    <Paper elevation={3} sx={{ width: "13rem", height: "13rem", p: 2, m: 2 }}>
      <Stack
        justifyContent="space-between"
        sx={{ width: "100%", height: "100%", p: 0, m: 0 }}
      >
        <Typography variant="h6" sx={{ fontSize: 15 }}>
          {title}
        </Typography>

        <Box
          sx={{
            flex: 1,
            textAlign: "center",
            justifyContent: "center",
            alignItems: "center",
            verticalAlign: "center",
            display: "flex",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              textAlign: "center",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {count}
          </Typography>
        </Box>
      </Stack>
    </Paper>
  );
}
