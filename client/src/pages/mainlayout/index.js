import React from "react";
import { CssBaseline } from "@material-ui/core";
import Navbar from "./Navbar";
import Gmail from "pages/gmailAuth/Gmail";

const MainLayout = ({ children, user }) => {
  return (
    <>
      <CssBaseline />
      <Navbar />
      {user && !user.hasGmailAuthorized && (
        <Gmail isOpen={!user.hasGmailAuthorized} onClose={() => {}}></Gmail>
      )}
      {children}
    </>
  );
};

export default MainLayout;
