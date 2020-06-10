import React, { useState } from "react";
import {
  makeStyles,
  Grid,
  Typography,
  Paper,
  IconButton,
  Menu,
  MenuItem,
} from "@material-ui/core";
import { Mail as MailIcon, MoreVert as MoreVertIcon } from "@material-ui/icons";
import { toSentenceCase } from "js-convert-case";
import { campaign } from "constants/routes";

const useStyles = makeStyles((theme) => ({
  container: {
    width: "100%",
    margin: "1rem 0 1rem 0",
    padding: "2.5rem 0 2.5rem 0",
  },
  stepInfoContainer: {
    paddingLeft: "3rem",
  },
  owner: {
    color: theme.palette.grey[400],
  },
  dataSummaryContainer: {
    width: "10rem",
  },
  dataLabel: {
    fontSize: "13px",
  },
  dataNumber: {
    fontWeight: theme.typography.fontWeightLight,
    marginTop: "7px",
  },
  optionsButton: {
    width: "5rem",
  },
}));

const Step = ({
  subject,
  userName,
  order,
  data,
  openUpdateStepEditor,
  stepId,
  campaignId,
  moveProspectsToStep,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState(null);

  const {
    container,
    stepInfoContainer,
    owner,
    dataSummaryContainer,
    dataLabel,
    dataNumber,
    optionsButton,
  } = useStyles();

  const clickEditMenuHandler = () => {
    openUpdateStepEditor(order, stepId);
    setIsMenuOpen(false);
  };

  const clickMoveProspectMenuHandler = () => {
    moveProspectsToStep(stepId, campaignId);
    setIsMenuOpen(false);
  };

  const clickOptionsMenuHandler = (e) => {
    setIsMenuOpen(true);
    setMenuAnchor(e.currentTarget);
  };

  return (
    <Grid className={container} item container component={Paper}>
      <Grid
        item
        container
        className={stepInfoContainer}
        xs={true}
        alignItems="center"
        spacing={5}
      >
        <Grid item>
          <MailIcon color="primary" />
        </Grid>
        <Grid item>
          <Typography variant="h4">{order}</Typography>
        </Grid>
        <Grid item>
          <Typography variant="h5">
            {order === 1 ? subject : "Follow up"}
          </Typography>
          <Typography className={owner} variant="subtitle2">
            By {userName}
          </Typography>
        </Grid>
      </Grid>
      {data.map(({ label, value }) => (
        <Grid
          className={dataSummaryContainer}
          key={label}
          item
          container
          direction="column"
          alignContent="center"
        >
          <Typography className={dataLabel} align="center">
            {label}
          </Typography>
          <Typography
            className={dataNumber}
            color="primary"
            align="center"
            variant="h5"
          >
            {value || 0}
          </Typography>
        </Grid>
      ))}
      <Grid
        className={optionsButton}
        item
        container
        justify="center"
        alignItems="center"
      >
        <IconButton onClick={clickOptionsMenuHandler}>
          <MoreVertIcon />
        </IconButton>

        <Menu
          elevation={3}
          anchorEl={menuAnchor}
          open={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
        >
          <MenuItem onClick={clickMoveProspectMenuHandler}>
            Move Prospects
          </MenuItem>
          <MenuItem onClick={clickEditMenuHandler}>Edit</MenuItem>
        </Menu>
      </Grid>
    </Grid>
  );
};

export default Step;
