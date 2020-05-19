import React from "react";
import {
  Typography,
  Grid,
  Snackbar,
  SnackbarContent,
  makeStyles
} from "@material-ui/core";
import { Error } from "@material-ui/icons";

//CSS styles
const useStyles = makeStyles({
  snackbarContentError: {
    backgroundColor: "#cc3300",
    height: "5rem"
  },
  icon: {
    marginRight: "10px"
  }
});

const ErrorSnackbar = ({ open, onClose, message }) => {
  const { snackbarContentError, icon } = useStyles();

  return (
    <Snackbar
      open={open}
      autoHideDuration={2000}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left"
      }}
      onClose={onClose}
    >
      <SnackbarContent
        className={snackbarContentError}
        message={
          <Grid container>
            <Error className={icon} />
            <Typography>{message}</Typography>
          </Grid>
        }
      />
    </Snackbar>
  );
};

export default ErrorSnackbar;
