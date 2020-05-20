import React from "react";
import { CssBaseline } from "@material-ui/core";
import Navbar from "./Navbar";

const MainLayout = ({ isAuthenticated, user, logout, children }) => {
  return (
    <>
      <CssBaseline />
      <Navbar isAuthenticated />
      {children}
    </>
  );
};

export default MainLayout;
