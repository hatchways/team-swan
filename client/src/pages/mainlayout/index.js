import React from "react";
import { CssBaseline } from "@material-ui/core";
import Navbar from "./Navbar";

const MainLayout = ({ children }) => {
  return (
    <>
      <CssBaseline />
      <Navbar />
      {children}
    </>
  );
};

export default MainLayout;
