import React, { useState, useEffect } from "react";
import {
  makeStyles,
  Grid,
  Typography,
  Button,
  IconButton,
} from "@material-ui/core";
import {
  Mail as MailIcon,
  Cached as CachedIcon,
  FlashOn as FlashIcon,
} from "@material-ui/icons";
import axios from "axios";
import { useParams } from "react-router-dom";
import withAuth from "common/withAuth";
import DataSummary from "./DataSummary";
import Step from "./Step";
import StepEditorDialog from "./StepEditorDialog";

const useStyles = makeStyles((theme) => ({
  container: {
    padding: "2rem",
  },
  campaignTitleContainer: {
    flexGrow: 1,
    "& h4": {
      marginBottom: "8px",
    },
    "& h6": {
      color: theme.palette.grey[400],
    },
  },
  iconButton: {
    color: theme.palette.grey[400],
    margin: "0 10px 0 10px",
  },
  button: {
    marginLeft: "10px",
    width: "10rem",
  },
}));

const Campaign = ({ user }) => {
  const [campaignInfo, setCampaignInfo] = useState({
    id: null,
    name: "",
    Steps: [],
  });
  const [stepEditorValues, setStepEditorValues] = useState({
    order: 1,
    campaignId: campaignInfo.id,
  });

  //utils
  const params = useParams();
  const { container, campaignTitleContainer, iconButton, button } = useStyles();

  const openCreateNewStepEditor = () => {
    setStepEditorValues({
      open: true,
      order: campaignInfo.Steps.length + 1,
      type: "create",
    });
  };

  const openUpdateStepEditor = (order) => {
    setStepEditorValues({
      open: true,
      order: order,
      type: "update",
    });
  };

  useEffect(() => {
    axios.get(`/api/campaign/${params.id}`).then((response) => {
      setCampaignInfo(response.data);
    });
  }, [params.id, stepEditorValues.open]);

  return (
    <Grid container className={container}>
      <Grid item container>
        <Grid className={campaignTitleContainer}>
          <Typography variant="h4">{campaignInfo.name}</Typography>
          <Typography variant="subtitle1">
            By {`${user.firstName} ${user.lastName}`}
          </Typography>
        </Grid>
        <Grid>
          <IconButton className={iconButton}>
            <FlashIcon />
          </IconButton>
          <IconButton className={iconButton}>
            <MailIcon />
          </IconButton>
          <IconButton className={iconButton}>
            <CachedIcon />
          </IconButton>
          <Button
            className={button}
            variant="contained"
            color="primary"
            size="large"
          >
            Add prospect
          </Button>
        </Grid>
      </Grid>
      <DataSummary
        data={[
          {
            label: "Contacted",
            value: campaignInfo.Steps.reduce(
              (accumulator, step) => accumulator + step.contacted,
              0
            ),
          },
          {
            label: "Relpied",
            value: campaignInfo.Steps.reduce(
              (accumulator, step) => accumulator + step.replied,
              0
            ),
          },
        ]}
      />
      {campaignInfo.Steps.map(({ subject, order, contacted, replied }) => (
        <Step
          key={order}
          subject={subject}
          userName={`${user.firstName} ${user.lastName}`}
          openUpdateStepEditor={openUpdateStepEditor}
          order={order}
          data={[
            {
              label: "Contacted",
              value: contacted,
            },
            {
              label: "Replied",
              value: replied,
            },
          ]}
        />
      ))}

      <Button
        className={button}
        variant="outlined"
        color="primary"
        size="large"
        onClick={() => {
          openCreateNewStepEditor();
        }}
      >
        Add step
      </Button>

      <StepEditorDialog
        open={stepEditorValues.open}
        order={stepEditorValues.order}
        campaignId={campaignInfo.id}
        type={stepEditorValues.type}
        onClose={() => {
          setStepEditorValues({ ...stepEditorValues, open: false });
        }}
      />
    </Grid>
  );
};

export default withAuth(Campaign);
