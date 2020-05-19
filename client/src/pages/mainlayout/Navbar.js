import React from "react";
import { AppBar, Toolbar, makeStyles } from "@material-ui/core";
import logo from "./logo.png";

//CSS styles
const useStyles = makeStyles({
  toolbar: {
    display: "flex"
  },
  imageContainer: {
    flexGrow: 1
  }
});

const Navbar = () => {
  const { toolbar, imageContainer } = useStyles();
  return (
    <AppBar color="secondary" elevation={0} position="relative">
      <Toolbar className={toolbar}>
        <div className={imageContainer}>
          <img src={logo} width="130" />
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
