import React from "react";
import { Paper, Typography, makeStyles, Grid } from "@material-ui/core";
import GoogleButton from "./GoogleButton";
import useSnackbar from "../../common/useSnackbar";

const useStyles = makeStyles({
  container: {
    width: "380px",
    height: "280px",
    margin: "60px auto 0 auto",
    padding: "3rem"
  },
  buttonContainer: {
    height: "100%",
    width: "100%"
  }
});

const Login = () => {
  const { container, buttonContainer } = useStyles();
  const { showErrorSnackbar } = useSnackbar();

  return (
    <Paper className={container} elevation={3}>
      <Typography variant="h4" display="block" align="center">
        Login
      </Typography>
      <Grid
        className={buttonContainer}
        container
        alignItems="center"
        justify="center"
      >
        <GoogleButton />
      </Grid>
    </Paper>
  );
};

export default Login;
