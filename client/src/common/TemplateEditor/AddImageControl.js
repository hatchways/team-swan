import React, { useState, useEffect } from "react";
import {
  makeStyles,
  Button,
  TextField,
  Grid,
  Paper,
  Dialog
} from "@material-ui/core";
import { Image } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: "1rem"
  },
  addImageButton: {
    marginLeft: "1rem"
  }
}));

const AddImageControl = ({ addImage }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [url, setUrl] = useState("");

  const { paper, addImageButton } = useStyles();

  const openMenu = (event) => {
    event.preventDefault();
    setIsDialogOpen(true);
    setAnchorEl(event.currentTarget);
  };

  return (
    <>
      <Button onMouseDown={openMenu} variant="contained" color="secondary">
        <Image />
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
          <Grid container>
            <Grid item xs={true}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                size="small"
              />
            </Grid>
            <Grid item>
              <Button
                className={addImageButton}
                variant="contained"
                color="primary"
                onMouseDown={(e) => {
                  e.preventDefault();
                  addImage(url);
                  setIsDialogOpen(false);
                }}
              >
                Add
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Dialog>
    </>
  );
};

export default AddImageControl;
