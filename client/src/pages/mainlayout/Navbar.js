import React from "react";
import { AppBar, Toolbar, makeStyles } from "@material-ui/core";
import logo from "./logo.png";
import withAuth from "common/withAuth";
import Navlinks from "./Navlinks";
import UserInfo from "./UserInfo";

//CSS styles
const useStyles = makeStyles({
  toolbar: {
    display: "flex"
  },
  imageContainer: {
    flexGrow: 1
  }
});

const Navbar = ({ isAuthenticated, user, logout }) => {
  const { toolbar, imageContainer } = useStyles();

  return (
    <AppBar color="secondary" elevation={0} position="relative">
      <Toolbar className={toolbar}>
        <div className={imageContainer}>
          <img src={logo} width="130" />
        </div>
        {isAuthenticated && (
          <>
            <Navlinks />
            <UserInfo user={user} logout={logout} />
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default withAuth(Navbar, false);
