import React from "react";
import PropTypes from "prop-types";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Check from "@material-ui/icons/Check";
import SettingsIcon from "@material-ui/icons/Settings";
import GroupAddIcon from "@material-ui/icons/GroupAdd";
import VideoLabelIcon from "@material-ui/icons/VideoLabel";
import StepConnector from "@material-ui/core/StepConnector";
import { Redirect } from 'react-router-dom';
import Typography from "@material-ui/core/Typography";
import UploadCSV from "./steps/UploadCSV";
import { Container } from "@material-ui/core";
import axios from "axios";
import useSnackBar from "common/useSnackbar";
import LinearProgress from "@material-ui/core/LinearProgress";
import MapCSV from "./steps/MapCSV";
import withAuth from "common/withAuth";
import AddProspects from "./steps/AddProspects";

const useQontoStepIconStyles = makeStyles({
  root: {
    color: "#eaeaf0",
    display: "flex",
    height: 22,
    alignItems: "center",
  },
  active: {
    color: "#784af4",
  },
  circle: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    backgroundColor: "currentColor",
  },
  completed: {
    color: "#784af4",
    zIndex: 1,
    fontSize: 18,
  },
});

function QontoStepIcon(props) {
  const classes = useQontoStepIconStyles();
  const { active, completed } = props;

  return (
    <div
      className={clsx(classes.root, {
        [classes.active]: active,
      })}
    >
      {completed ? (
        <Check className={classes.completed} />
      ) : (
          <div className={classes.circle} />
        )}
    </div>
  );
}

QontoStepIcon.propTypes = {
  /**
   * Whether this step is active.
   */
  active: PropTypes.bool,
  /**
   * Mark the step as completed. Is passed to child components.
   */
  completed: PropTypes.bool,
};

const ColorlibConnector = withStyles({
  alternativeLabel: {
    top: 22,
  },
  active: {
    "& $line": {
      backgroundImage:
        "linear-gradient( 95deg, rgb(42, 168, 151) 0%, rgb(79, 190, 117) 100%)",
    },
  },
  completed: {
    "& $line": {
      backgroundImage:
        "linear-gradient( 95deg, rgb(42, 168, 151) 0%, rgb(79, 190, 117) 100%)",
    },
  },
  line: {
    height: 3,
    border: 0,
    backgroundColor: "#eaeaf0",
    borderRadius: 1,
  },
})(StepConnector);

const useColorlibStepIconStyles = makeStyles({
  root: {
    backgroundColor: "#ccc",
    zIndex: 1,
    color: "#fff",
    width: 50,
    height: 50,
    display: "flex",
    borderRadius: "50%",
    justifyContent: "center",
    alignItems: "center",
  },
  active: {
    backgroundImage:
      "linear-gradient( 136deg, rgb(42, 168, 151) 0%, rgb(79, 190, 117) 100%)",
    boxShadow: "0 4px 10px 0 rgba(0,0,0,.25)",
  },
  completed: {
    backgroundImage:
      "linear-gradient( 136deg, rgb(42, 168, 151) 0%, rgb(79, 190, 117) 100%)",
  },
});

function ColorlibStepIcon(props) {
  const classes = useColorlibStepIconStyles();
  const { active, completed } = props;

  const icons = {
    1: <SettingsIcon />,
    2: <GroupAddIcon />,
    3: <VideoLabelIcon />,
  };

  return (
    <div
      className={clsx(classes.root, {
        [classes.active]: active,
        [classes.completed]: completed,
      })}
    >
      {icons[String(props.icon)]}
    </div>
  );
}

ColorlibStepIcon.propTypes = {
  /**
   * Whether this step is active.
   */
  active: PropTypes.bool,
  /**
   * Mark the step as completed. Is passed to child components.
   */
  completed: PropTypes.bool,
  /**
   * The label displayed in the step icon.
   */
  icon: PropTypes.node,
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  button: {
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

function getSteps() {
  return ["Upload a csv file", "Map csv to users", "Create prospects"];
}

function getStepContent(step, props) {
  switch (step) {
    case 0:
      return (
        <div>
          <UploadCSV setFile={props.setFile}></UploadCSV>
        </div>
      );
    case 1:
      return (
        <div>
          <MapCSV properties={props.properties}
            attributes={props.attributes}
            tableHead={props.tableHead}
            mappedAttributes={props.mappedAttributes}
            setMappedAttributes={props.setMappedAttributes}></MapCSV>
        </div>
      );
    case 2:
      return <AddProspects
        mappedAttributes={props.mappedAttributes}
        setActiveStep={props.setActiveStep}></AddProspects>;
    default:
      return "Unknown step";
  }
}

const ImportProspects = () => {
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const [file, setFile] = React.useState([]);
  const steps = getSteps();
  const [isLoading, setLoading] = React.useState(false);
  const [properties, setProperties] = React.useState([]);
  const [attributes, setAttributes] = React.useState([])
  const [mappedAttributes, setMappedAttributes] = React.useState({})
  const showSnackbar = useSnackBar();

  const prevFile = React.useRef();

  React.useEffect(() => {
    const uploadFile = async (fileToBeUploaded) => {
      if (
        Array.isArray(fileToBeUploaded) &&
        fileToBeUploaded.length > 0 &&
        fileToBeUploaded !== prevFile.current
      ) {
        setLoading(true);
        const formData = new FormData();
        formData.append("prospects", fileToBeUploaded[0]);

        const config = {
          headers: {
            "content-type": "multipart/form-data",
          },
        };

        try {
          const request = await axios.post("/api/upload", formData, config);
          setMappedAttributes({})
          setProperties(request.data.properties);
          setAttributes(request.data.attributes);
          setActiveStep((prevActiveStep) => prevActiveStep + 1);
          showSnackbar(request.data.message, "success");
          setLoading(false);
        } catch (err) {
          setLoading(false);
          showSnackbar(
            err.response && err.response.data.errors ? err.response.data.errors[0].message : "Error!",
            "error"
          );
        }
      }
    };

    uploadFile(file);
  }, [file, showSnackbar]);

  React.useEffect(() => {
    if (attributes.length !== 0 && mappedAttributes) {
      let moveToFinalization = true
      attributes.forEach(attr => {
        if (!mappedAttributes[attr]) {
          moveToFinalization = false
        }
      })
      if (moveToFinalization) {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      }
    }
  }, [attributes, mappedAttributes])


  React.useEffect(() => {
    prevFile.current = file;
  }, [file]);

  const props = {
    setFile: setFile,
    properties: properties,
    tableHead: ['OUR PROSPECT FIELDS', 'IMPORT DATA HEADER'],
    attributes: attributes,
    setMappedAttributes: setMappedAttributes,
    mappedAttributes: mappedAttributes,
    setActiveStep: setActiveStep
  };

  return (
    <div className={classes.root}>
      <Stepper
        alternativeLabel
        activeStep={activeStep}
        connector={<ColorlibConnector />}
      >
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel StepIconComponent={ColorlibStepIcon}>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <Container>
        <div>
          {activeStep === steps.length ? (
            <div>
              <Redirect to="/campaigns"></Redirect>
            </div>
          ) : (
              <div>
                <Typography className={classes.instructions} component={"div"}>
                  {isLoading ? (
                    <LinearProgress />
                  ) : (
                      getStepContent(activeStep, props)
                    )}
                </Typography>

              </div>
            )}
        </div>
      </Container>
    </div>
  );
}

export default withAuth(ImportProspects);