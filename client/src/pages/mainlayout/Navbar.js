import React from "react";
import { AppBar, makeStyles } from "@material-ui/core";
import logo from "./logo.png";
import withAuth from "common/withAuth";
import Navlinks from "./Navlinks";
import Profile from "./Profile";

//CSS styles
const useStyles = makeStyles((theme) => ({
  navbar: {
    display: "flex",
    flexDirection: "row",
    height: "6rem",
    alignItems: "center",
    padding: "0 2rem 0 2rem",
    borderBottom: "1px solid #E0E0E0",
    zIndex: theme.zIndex.drawer + 1,
  },
  imageContainer: {
    flexGrow: 1,
  },
}));

const Navbar = ({ isAuthenticated, user, logout }) => {
  const { navbar, imageContainer } = useStyles();

  return (
    <AppBar
      className={navbar}
      color="secondary"
      elevation={0}
      position="relative"
    >
      <div className={imageContainer}>
        <img src={logo} width="130" />
      </div>
      {isAuthenticated && (
        <>
          <Navlinks />
          <Profile user={user} logout={logout} />
        </>
      )}
    </AppBar>
  );
};

export default withAuth(Navbar, false);
