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
import withAuth from "common/withAuth";
import DataSummary from "./DataSummary";
import Step from "./Step";
import { useParams } from "react-router-dom";
import useSnackBar from "common/useSnackbar";
import axios from "axios";
import StepEditorDialog from "./StepEditorDialog";
import Gmail from "pages/gmailAuth/Gmail";

const useStyles = makeStyles((theme) => ({
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

const SummaryPage = ({ user, socket }) => {
  const [campaignInfo, setCampaignInfo] = useState({
    id: null,
    name: "",
    Steps: [],
  });
  const [shouldPageUpdate, setShouldPageUpdate] = useState(false);
  useEffect(() => {
    if (socket) {
      socket.on("update", () => {
        getCampaignInfo();
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

  const [isGmailModalOpen, setIsGmailModalOpen] = useState(false);
  const [stepEditorValues, setStepEditorValues] = useState({
    order: 1,
    campaignId: campaignInfo.id,
  });

  //utils
  const params = useParams();
  const showSnackbar = useSnackBar();

  const openCreateNewStepEditor = () => {
    setStepEditorValues({
      open: true,
      order: campaignInfo.Steps.length + 1,
      type: "create",
    });
  };

  const openUpdateStepEditor = (order, id) => {
    setStepEditorValues({
      open: true,
      id: id,
      order: order,
      type: "update",
    });
  };

  const moveProspectsToStep = (stepId, campaignId) => {
    axios
      .put(`/api/campaign/${campaignId}/step/${stepId}`)
      .then((response) => {
        getCampaignInfo();
        showSnackbar("Successfully moved prospects");
      })
      .catch((error) => {
        showSnackbar(error.response.data.errors[0].message, "error");
      });
  };

  const getCampaignInfo = () => {
    axios.get(`/api/campaign/${params.id}`).then((response) => {
      const newData = response.data;
      newData.contacted = parseInt(0);
      newData.replied = parseInt(0);
      newData.Steps.forEach((step) => {
        newData.contacted += parseInt(step.contactedCount);
        newData.replied += parseInt(step.repliedCount);
      });
      setCampaignInfo(newData);
    });
  };

  useEffect(() => {
    getCampaignInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepEditorValues.open]);

  const { campaignTitleContainer, iconButton, button } = useStyles();

  return (
    <>
      <Grid container>
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
            <IconButton
              className={iconButton}
              disabled={!shouldPageUpdate}
              onClick={() => {
                getCampaignInfo();
                setShouldPageUpdate(false);
              }}
            >
              <CachedIcon color={shouldPageUpdate ? "primary" : "disabled"} />
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
              value: campaignInfo.contactedCount || 0,
            },
            {
              label: "Replied",
              value: campaignInfo.repliedCount || 0,
            },
            {
              label: "Pending",
              value: campaignInfo.pendingCount || 0,
            },
            {
              label: "Active",
              value: campaignInfo.activeCount || 0,
            },
          ]}
        />
        {campaignInfo.Steps.map(
          ({
            id,
            subject,
            order,
            contactedCount,
            repliedCount,
            prospectCount,
          }) => (
            <Step
              key={id}
              stepId={id}
              campaignId={campaignInfo.id}
              subject={subject}
              userName={`${user.firstName} ${user.lastName}`}
              openUpdateStepEditor={openUpdateStepEditor}
              order={order}
              moveProspectsToStep={moveProspectsToStep}
              hasGmailAuthorized={user.hasGmailAuthorized}
              openGmailModal={() => {
                setIsGmailModalOpen(true);
              }}
              data={[
                {
                  label: "Contacted",
                  value: contactedCount,
                },
                {
                  label: "Replied",
                  value: repliedCount,
                },
                {
                  label: "Prospect",
                  value: prospectCount,
                },
              ]}
            />
          )
        )}

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
          id={stepEditorValues.id}
          open={stepEditorValues.open}
          order={stepEditorValues.order}
          campaignId={campaignInfo.id}
          type={stepEditorValues.type}
          onClose={() => {
            setStepEditorValues({ ...stepEditorValues, open: false });
          }}
        />
      </Grid>
      {isGmailModalOpen && (
        <Gmail
          isOpen={isGmailModalOpen}
          onClose={() => {
            setIsGmailModalOpen(false);
          }}
        ></Gmail>
      )}
    </>
  );
};

export default withAuth(SummaryPage);
