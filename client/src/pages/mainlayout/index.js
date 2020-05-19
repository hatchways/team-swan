import React from "react";
import { MuiThemeProvider, CssBaseline } from "@material-ui/core";
import { BrowserRouter } from "react-router-dom";
import { theme } from "../../themes/theme";
import Navbar from "./Navbar";
import SnackbarProvider from "../../common/SnackbarProvider";

const MainLayout = ({ children }) => {
  return (
    <MuiThemeProvider theme={theme}>
      <SnackbarProvider>
        <CssBaseline />
        <BrowserRouter>
          <Navbar />
          {children}
        </BrowserRouter>
      </SnackbarProvider>
    </MuiThemeProvider>
  );
};

export default MainLayout;
