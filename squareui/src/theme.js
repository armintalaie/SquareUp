import { Button, Paper, Container, Box, TextField } from "@mui/material";
import { styled, createTheme, ThemeProvider } from "@mui/system";
import SendIcon from "@mui/icons-material/Send";


export const ActionButton = styled(Button)({
    boxShadow: 'none',
    textTransform: 'none',
    fontSize: 16,
    minWidth: "10rem",
    margin: "1rem",
    padding: '10px 10px',
    borderRadius: '5px',
    lineHeight: 1.5,
    color: "primary",
    backgroundColor: '#5052A5',
    fontFamily: [
        'futura'
    ].join(','),

    '&:hover': {
        backgroundColor: '#5052A5',
        borderColor: '#34b3a4',
        boxShadow: 'none',
    },
    '&:active': {
        boxShadow: 'none',
        backgroundColor: '#34b3a4',
        borderColor: '#005cbf',
    },
    '&:focus': {
        boxShadow: '#34b3a4',
    },
});



export const FieldForm = styled(TextField)({
    padding: 2,
    margin: 4,
    maxWidth: "40rem",


});