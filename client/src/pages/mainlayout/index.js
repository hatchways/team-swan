import React from "react";
import { CssBaseline } from "@material-ui/core";
import Navbar from "./Navbar";
import Gmail from "pages/gmailAuth/Gmail";

const MainLayout = ({ children }) => {
  return (
    <>
      <CssBaseline />
      <Navbar />
      <Gmail></Gmail>
      {children}
    </>
  );
};

export default MainLayout;
