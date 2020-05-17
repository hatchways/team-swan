import React, { useState, useEffect, createContext } from "react";
import {
  Typography,
  Grid,
  Snackbar,
  SnackbarContent,
  makeStyles
} from "@material-ui/core";
import { Error, Check } from "@material-ui/icons";

export const SnackbarContext = createContext();

//Make styles hooks
const useStyles = makeStyles({
  snackbarContentError: {
    backgroundColor: "#cc3300",
    height: "5rem"
  },
  snackbarContentSuccess: {
    backgroundColor: "#3eb485",
    height: "5rem"
  },
  icon: {
    marginRight: "10px"
  }
});

const SnackbarProvider = ({ children }) => {
  //Snackbar Error State
  const [isErrorSnackbarOpen, setIsErrorSnackbarOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  //Snackbar Success State
  const [isSuccessSnackbarOpen, setIsSuccessSnackbarOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  //Close success snackbar if error snack bar opens
  useEffect(() => {
    if (isErrorSnackbarOpen) {
      setIsSuccessSnackbarOpen(false);
    }
  }, [isErrorSnackbarOpen]);

  //Close error snackbar if success snack bar opens
  useEffect(() => {
    if (isSuccessSnackbarOpen) {
      setIsErrorSnackbarOpen(false);
    }
  }, [isSuccessSnackbarOpen]);

  //Styles from makeStyles function
  const { snackbarContentError, snackbarContentSuccess, icon } = useStyles();

  //Snackbars
  const ErrorSnackBar = (
    <Snackbar
      open={isErrorSnackbarOpen}
      autoHideDuration={2000}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left"
      }}
      onClose={() => {
        setIsErrorSnackbarOpen(false);
      }}
    >
      <SnackbarContent
        className={snackbarContentError}
        message={
          <Grid container>
            <Error className={icon} />
            <Typography>{errorMessage}</Typography>
          </Grid>
        }
      />
    </Snackbar>
  );

  const SuccessSnackBar = (
    <Snackbar
      open={isSuccessSnackbarOpen}
      autoHideDuration={2000}
      onClose={() => {
        setIsErrorSnackbarOpen(false);
      }}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left"
      }}
    >
      <SnackbarContent
        className={snackbarContentSuccess}
        message={
          <Grid container>
            <Error className={icon} />
            <Typography>{successMessage}</Typography>
          </Grid>
        }
      />
    </Snackbar>
  );

  return (
    <SnackbarContext.Provider
      value={{
        setErrorMessage,
        setIsErrorSnackbarOpen,
        setSuccessMessage,
        setIsSuccessSnackbarOpen
      }}
    >
      {ErrorSnackBar}
      {SuccessSnackBar}
      {children}
    </SnackbarContext.Provider>
  );
};

export default SnackbarProvider;
