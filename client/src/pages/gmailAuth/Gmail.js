import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import { DialogContentText } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import withAuth from "common/withAuth";
import axios from "axios";
import useSnackbar from "common/useSnackbar";

function ConfirmationDialogRaw(props) {
  const classes = useStyles();
  const { onClose, handleAgree, open, ...other } = props;

  const handleCancel = () => {
    onClose();
  };

  return (
    <Dialog
      className={classes.root}
      disableBackdropClick
      disableEscapeKeyDown
      open={open}
      {...other}
      onClose={handleCancel}
    >
      <DialogTitle id="responsive-dialog-title">
        {"Authorize Gmail Account Access"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          To use our application, we would need you to authorize us to access
          your gmail account.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleCancel} color="primary">
          Disagree
        </Button>
        <Button onClick={handleAgree} color="primary" autoFocus>
          Agree
        </Button>
      </DialogActions>
    </Dialog>
  );
}

ConfirmationDialogRaw.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  value: PropTypes.string.isRequired,
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: "70%",
    zIndex: theme.zIndex.drawer + 10,
    margin: "auto",
  },
  paper: {
    width: "80%",
    maxHeight: 435,
    backgroundColor: theme.palette.background.paper,
  },
}));

function ConfirmationDialog({ isOpen, onClose }) {
  const showSnackBar = useSnackbar();
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
    setOpen(false);
  };

  const handleAgree = () => {
    axios
      .get("/gmail/authurl")
      .then((response) => {
        const route = response.data.route;
        return (window.location = route);
      })
      .catch((error) => {
        showSnackBar("Error", "error");
      });
  };

  return (
    <div className={classes.root}>
      <ConfirmationDialogRaw
        classes={{
          paper: classes.paper,
        }}
        id="ringtone-menu"
        keepMounted
        open={open}
        onClose={handleClose}
        handleAgree={handleAgree}
      />
    </div>
  );
}

export default ConfirmationDialog;
