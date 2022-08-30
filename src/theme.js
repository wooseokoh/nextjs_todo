import { createTheme } from "@mui/material/styles";
import { red } from "@mui/material/colors";

// Create a theme instance.
const theme = createTheme({
  typography: {
    fontFamily: ["GmarketSansMedium"],
  },
  palette: {
    primary: {
      main: "#ff8686",
      contrastText: "#ffffff",
    },
  },
});

export default theme;
