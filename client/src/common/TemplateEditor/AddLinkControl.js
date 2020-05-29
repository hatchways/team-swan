import React, { useState, useEffect } from "react";
import {
  makeStyles,
  Button,
  TextField,
  Paper,
  Dialog
} from "@material-ui/core";
import { Link } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: "1rem",
    width: "300px"
  },
  margin: {
    marginTop: "1rem"
  }
}));

const AddLinkControl = ({ addLink }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [label, setLabel] = useState("");

  const { paper, margin } = useStyles();

  const openMenu = (event) => {
    event.preventDefault();
    setIsDialogOpen(true);
    setAnchorEl(event.currentTarget);
  };

  return (
    <>
      <Button onMouseDown={openMenu} variant="contained" color="secondary">
        <Link />
      </Button>

      <Dialog
        open={isDialogOpen}
        anchorEl={anchorEl}
        role={undefined}
        onClose={() => {
          setIsDialogOpen(false);
        }}
      >
        <Paper className={paper}>
          <TextField
            className={margin}
            fullWidth
            variant="outlined"
            placeholder="label"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            size="small"
          />

          <TextField
            className={margin}
            fullWidth
            variant="outlined"
            placeholder="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            size="small"
          />

          <Button
            className={margin}
            variant="contained"
            color="primary"
            onMouseDown={(e) => {
              e.preventDefault();
              addLink(label, url);
              setIsDialogOpen(false);
            }}
          >
            Add
          </Button>
        </Paper>
      </Dialog>
    </>
  );
};

export default AddLinkControl;
