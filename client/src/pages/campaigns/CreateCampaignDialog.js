import React from "react";
import {
  makeStyles,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  paper: {
    width: "400px",
  },
}));

const CreateCampaignDialog = ({
  open,
  onClose,
  onSubmit,
  campaignNameTextField,
  setCampaignNameTextField,
}) => {
  const { paper } = useStyles();

  return (
    <Dialog open={open} onClose={onClose} PaperProps={{ className: paper }}>
      <DialogTitle>Create Campaign</DialogTitle>
      <DialogContent>
        <TextField
          variant="outlined"
          label="Name"
          type="email"
          fullWidth
          value={campaignNameTextField}
          onChange={(e) => setCampaignNameTextField(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={onSubmit} color="primary">
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateCampaignDialog;
