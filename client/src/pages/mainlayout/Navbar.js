import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  makeStyles
} from "@material-ui/core";
import logo from "./logo.png";

const useStyles = makeStyles({
  toolbar: {
    display: "flex"
  },
  imageContainer: {
    flexGrow: 1
  },
  createGoogleAcountButton: {
    marginLeft: "2rem"
  }
});

const Navbar = () => {
  const { toolbar, imageContainer, createGoogleAcountButton } = useStyles();
  return (
    <AppBar color="secondary" elevation={0} position="relative">
      <Toolbar className={toolbar}>
        <div className={imageContainer}>
          <img src={logo} width="120" />
        </div>
        <Typography>Don't have an account?</Typography>
        <Button
          className={createGoogleAcountButton}
          size="large"
          variant="outlined"
          color="primary"
          href="https://accounts.google.com/signup/v2/webcreateaccount?hl=en&flowName=GlifWebSignIn&flowEntry=SignUp"
        >
          Create Google Account
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
