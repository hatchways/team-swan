import React from "react";
import {
  Typography,
  Grid,
  Snackbar as MaterialUISnackbar,
  SnackbarContent,
  makeStyles
} from "@material-ui/core";
import { Error, Check } from "@material-ui/icons";

//CSS styles
const useStyles = makeStyles({
  snackbarContentError: {
    backgroundColor: (props) =>
      props.type === "error" ? "#cc3300" : "#3eb485",
    height: "5rem"
  },
  icon: {
    marginRight: "10px"
  }
});

const Snackbar = ({ open, onClose, message, type }) => {
  const { snackbarContentError, icon } = useStyles({ type });

  return (
    <MaterialUISnackbar
      key={message + type}
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
            {type === "error" ? (
              <Error className={icon} />
            ) : (
              <Check className={icon} />
            )}
            <Typography>{message}</Typography>
          </Grid>
        }
      />
    </MaterialUISnackbar>
  );
};

export default Snackbar;
