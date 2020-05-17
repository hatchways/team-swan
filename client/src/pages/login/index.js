import React from "react";
import { Paper, Typography, makeStyles, Grid } from "@material-ui/core";
import { GoogleLogin } from "react-google-login";
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
  console.log(process.env.REACT_APP_CLIENT_ID);
  const { container, buttonContainer } = useStyles();
  const { showErrorSnackbar } = useSnackbar();

  const googleSuccessResponse = (response) => {
    //TODO (sending the authorization code to backend to get the tokens)
  };

  const googleFailureResponse = (response) => {
    console.log("ERROR");
    console.log(response);
    showErrorSnackbar("An error occured while logging in");
  };

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
        <GoogleLogin
          clientId={process.env.REACT_APP_CLIENT_ID}
          onSuccess={googleSuccessResponse}
          onFailure={googleFailureResponse}
          responseType="code"
          accessType="offline"
          render={(props) => (
            <GoogleButton onClick={props.onClick} disabled={props.disabled} />
          )}
        />
      </Grid>
    </Paper>
  );
};

export default Login;
