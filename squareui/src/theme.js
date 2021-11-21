import { Button, TextField } from "@mui/material";
import { styled } from "@mui/system";

export const ActionButton = styled(Button)({
  boxShadow: "none",
  textTransform: "none",
  fontSize: 16,
  minWidth: "10rem",
  margin: "1rem",
  padding: "10px 10px",
  borderRadius: "5px",
  lineHeight: 1.5,
  color: "primary",
  transition: "background 0.5s, color 0.5s , width 0.5s",
  fontFamily: ["futura"].join(","),

  "&:hover": {
    backgroundColor: "#3C91E6",
    borderColor: "#3C91E6",
    boxShadow: "none",
    minWidth: "rem",
  },
  "&:active": {
    boxShadow: "none",
    backgroundColor: "#1970C8",
    borderColor: "#3C91E6",
    minWidth: "10rem",
  },
  "&:focus": {
    boxShadow: "#388FE5",
    minWidth: "10rem",
  },
});

export const FieldForm = styled(TextField)({
  padding: 2,
  margin: 4,
  maxWidth: "40rem",
});
