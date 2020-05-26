import React from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
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
import { Connector, ColorStepIcon } from 'pages/importProspects/component/StepsHeader'

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
        setActiveStep={props.setActiveStep}
        filename={props.filename}></AddProspects>;
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
  const [filename, setFilename] = React.useState(null)
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
          setFilename(request.data.filename)
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
    setActiveStep: setActiveStep,
    filename: filename
  };

  return (
    <div className={classes.root}>
      <Stepper
        alternativeLabel
        activeStep={activeStep}
        connector={<Connector />}
      >
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel StepIconComponent={ColorStepIcon}>{label}</StepLabel>
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