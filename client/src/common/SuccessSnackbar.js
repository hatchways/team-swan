import React from "react";
import {
  Typography,
  Grid,
  Snackbar,
  SnackbarContent,
  makeStyles
} from "@material-ui/core";
import { Check } from "@material-ui/icons";

//CSS styles
const useStyles = makeStyles({
  snackbarContentSuccess: {
    backgroundColor: "#3eb485",
    height: "5rem"
  },
  icon: {
    marginRight: "10px"
  }
});

const SuccessSnackbar = ({ open, onClose, message }) => {
  const { snackbarContentSuccess, icon } = useStyles();

  return (
    <Snackbar
      open={open}
      autoHideDuration={2000}
      onClose={onClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left"
      }}
    >
      <SnackbarContent
        className={snackbarContentSuccess}
        message={
          <Grid container>
            <Check className={icon} />
            <Typography>{message}</Typography>
          </Grid>
        }
      />
    </Snackbar>
  );
};

export default SuccessSnackbar;
