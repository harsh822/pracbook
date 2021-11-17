import React from "react";
import ReactDOM from "react-dom";
import "./client/index.css";
import App from "./client/App";
import reportWebVitals from "./reportWebVitals";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { BrowserRouter } from "react-router-dom";

const theme = createTheme({
  typography: {
    useNextVariants: true,
  },
  breakpoints: {
    values: {
      xs: 320,
      sm: 650,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
});

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

reportWebVitals();
