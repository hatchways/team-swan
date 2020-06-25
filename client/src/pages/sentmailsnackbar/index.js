import React from "react";
import Button from "@material-ui/core/Button";
import {
  Snackbar,
  LinearProgress,
  SnackbarContent,
  Typography,
  Grid,
  IconButton,
  CircularProgress,
} from "@material-ui/core";
import { Close } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";

//CSS styles
const useStyles = makeStyles((theme) => ({
  snackbarContentError: {
    backgroundColor: "rgba(255,255,255,0.4)",
    border: `1px solid black`,
  },
  content: {},
}));

const SentMailSnackBar = ({ socket }) => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState(null);

  if (socket) {
    socket.on("sendEmail", (message) => {
      setMessage(message);
      if (!open) {
        setOpen(true);
      }
    });
  }

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  return (
    <>
      {message && (
        <Snackbar
          open={open}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          onClose={handleClose}
          ContentProps={{ className: classes.snackbarContentError }}
          message={
            <Grid
              container
              justify={"center"}
              alignItems={"center"}
              spacing={2}
            >
              <Grid item>
                <CircularProgress
                  variant="determinate"
                  value={(message.sent * 100) / message.total}
                />
              </Grid>
              <Grid item>
                <Typography color="primary">
                  {message.sent} of {message.total} emails sent
                </Typography>
              </Grid>
            </Grid>
          }
          action={
            <React.Fragment>
              <IconButton
                aria-label="close"
                color="inherit"
                onClick={handleClose}
              >
                <Close color={"primary"} />
              </IconButton>
            </React.Fragment>
          }
        ></Snackbar>
      )}
    </>
  );
};
export default SentMailSnackBar;
