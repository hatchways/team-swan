import React, { useState, useRef, useEffect } from "react";
import {
  makeStyles,
  Dialog,
  DialogTitle,
  Typography,
  Grid,
  IconButton,
  Input,
  Button,
  CircularProgress,
} from "@material-ui/core";
import { Close } from "@material-ui/icons";
import TemplateEditor from "common/TemplateEditor";
import axios from "axios";
import useSnackbar from "common/useSnackbar";

const useStyles = makeStyles((theme) => ({
  editorContainer: {
    padding: "1rem",
  },
  paper: {
    display: "flex",
    flexDirection: "column",
  },
  dialogTitleName: {
    color: theme.palette.grey[400],
    paddingLeft: "1.5rem",
  },
  templateTitle: {
    paddingRight: "1.5rem",
    borderRight: `1px ${theme.palette.grey[300]} solid`,
  },
  subjectInputContainer: {
    borderTop: `1px ${theme.palette.grey[300]} solid`,
    borderBottom: `1px ${theme.palette.grey[300]} solid`,
    padding: "2px 0 2pxrem 0",
    "& input": {
      height: "2rem",
      marginLeft: "2rem",
      border: "none",
    },
  },
  buttonContainer: {
    padding: "1rem",
    marginTop: "1rem",
    borderRadius: "5px",
    background:
      "linear-gradient(99deg, rgba(42,168,151,1) 10%, rgba(79,190,117,1) 100%)",
    "& button": {
      margin: "0 0.5rem 0 0.5rem",
      width: "6rem",
    },
  },
  loadingContainer: {
    height: 20 + "vh",
    width: 20 + "vh",
  },
}));

const StepEditorDialog = ({ open, onClose, type, campaignId, order }) => {
  const [subject, setSubject] = useState("");
  const [bodyRawContent, setBodyRawContent] = useState("");
  const [isDataLoading, setIsDataLoading] = useState(true);

  const templateEditorRef = useRef();
  const showSnackbar = useSnackbar();

  useEffect(() => {
    setIsDataLoading(true);
    if (type === "update") {
      axios
        .get(`/api/campaign/${campaignId}/step/${order}`)
        .then((response) => {
          setSubject(response.data.subject);
          setBodyRawContent(JSON.parse(response.data.body));
          setIsDataLoading(false);
        })
        .catch((error) => {
          showSnackbar(error.response.data.errors[0].message, "error");
          onClose();
        });
    } else {
      setIsDataLoading(false);
      setSubject("");
      setBodyRawContent("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const onSaveHandler = async () => {
    const stringifiedRawContent = JSON.stringify(
      templateEditorRef.current.getRawContent()
    );

    try {
      if (type === "update") {
        const response = await axios.put(
          `/api/campaign/${campaignId}/step/${order}`,
          {
            subject: subject,
            body: stringifiedRawContent,
          }
        );
      } else {
        const response = await axios.post(`/api/campaign/${campaignId}/step`, {
          subject: subject,
          body: stringifiedRawContent,
        });
      }
      showSnackbar("Campaign step saved", "success");
      onClose();
    } catch (error) {
      showSnackbar(error.response.data.errors[0].message, "error");
      onClose();
    }
  };

  const {
    editorContainer,
    paper,
    dialogTitleName,
    templateTitle,
    subjectInputContainer,
    buttonContainer,
    loadingContainer,
  } = useStyles();

  return (
    <Dialog
      open={open || false}
      onClose={onClose}
      PaperProps={{ className: paper }}
      maxWidth="md"
    >
      {isDataLoading ? (
        <Grid
          container
          className={loadingContainer}
          direction="row"
          justify="center"
          alignItems="center"
        >
          <Grid item>
            <CircularProgress />
          </Grid>{" "}
        </Grid>
      ) : (
        <>
          <DialogTitle>
            <Grid container alignItems="center">
              <Grid item>
                <Typography className={templateTitle} variant="h5">
                  {`Step ${order}`}
                </Typography>
              </Grid>
              <Grid item xs={true}>
                <Typography className={dialogTitleName}>
                  Edit template
                </Typography>
              </Grid>
              <Grid item>
                <IconButton onClick={onClose}>
                  <Close />
                </IconButton>
              </Grid>
            </Grid>
          </DialogTitle>

          <Grid className={subjectInputContainer} container alignItems="center">
            <Grid item>
              <Typography className={dialogTitleName}>Subject</Typography>
            </Grid>
            <Grid item xs={true}>
              <Input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                fullWidth
                disableUnderline
              />
            </Grid>
          </Grid>

          <Grid className={editorContainer}>
            <TemplateEditor
              ref={templateEditorRef}
              rawContent={bodyRawContent}
            />

            <Grid container className={buttonContainer}>
              <Grid item xs={true}>
                <Button variant="outlined" color="secondary" size="large">
                  Variables
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant="text"
                  color="secondary"
                  size="large"
                  onClick={onClose}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  size="large"
                  onClick={onSaveHandler}
                >
                  Save
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </>
      )}
    </Dialog>
  );
};

export default StepEditorDialog;
