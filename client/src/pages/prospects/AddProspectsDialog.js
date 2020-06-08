import React from "react";
import Button from "@material-ui/core/Button";
import axios from "axios";
import {
  Select,
  InputLabel,
  FormControl,
  DialogTitle,
  DialogContentText,
  DialogContent,
  DialogActions,
  Dialog,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import useSnackBar from "common/useSnackbar";

const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(1),
  },
}));

export default function AddProspectsDialog({
  isOpen,
  handleClose,
  selectedProspects,
}) {
  const [campaignsData, setCampaignsData] = React.useState([]);
  const [campaign, setCampaign] = React.useState();
  const makeSnackBar = useSnackBar();
  const handleChange = (event) => {
    setCampaign(event.target.value);
  };

  const handleSubmit = () => {
    axios
      .post(`/api/campaign/${campaign}/addProspects`, {
        prospects: Array.from(selectedProspects),
      })
      .then((result) => {
        handleClose();
      })
      .catch((err) => {
        makeSnackBar("Error adding prospects. Try again later!", "error");
        handleClose();
      });
  };

  React.useEffect(() => {
    if (isOpen) {
      axios
        .get("/api/campaign")
        .then((response) => {
          setCampaignsData(response.data);
        })
        .catch((err) => {
          handleClose();
        });
    }
  }, [handleClose, isOpen]);

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {"Select a Campaign to add prospects"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {campaignsData && campaignsData.length > 0 ? (
            <FormControl variant="outlined" fullWidth={true}>
              <InputLabel htmlFor="outlined-campaign-selector">
                Campaign
              </InputLabel>
              <Select
                native
                value={campaign}
                onChange={handleChange}
                label="Campaign"
                inputProps={{
                  name: "Campaign",
                  id: "outlined-campaign-selector",
                }}
              >
                <option aria-label="None" value="" />
                {campaignsData.map((campaign) => {
                  return <option value={campaign.id}>{campaign.name}</option>;
                })}
              </Select>
            </FormControl>
          ) : (
            "No Campaigns Found!"
          )}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          color="primary"
          autoFocus
          disabled={!campaign}
        >
          Add Prospects
        </Button>
      </DialogActions>
    </Dialog>
  );
}
