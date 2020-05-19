import React from "react";
import {
  TextField,
  Paper,
  Typography,
  makeStyles,
  Button
} from "@material-ui/core";

//CSS styles
const useStyles = makeStyles({
  container: {
    width: "490px",
    margin: "40px auto 0 auto",
    padding: "2rem 4rem 2rem 4rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  formTitle: {
    marginBottom: "20px"
  },
  button: {
    width: "10rem",
    margin: "1rem 0 2rem 0"
  },
  textField: {
    marginTop: "10px"
  }
});

const InitialPageForm = ({
  title,
  fields,
  onSubmit,
  submitButtonName,
  footer
}) => {
  const { container, button, textField, formTitle } = useStyles();

  return (
    <Paper className={container} elevation={3} spacing={2}>
      <Typography
        className={formTitle}
        variant="h4"
        display="block"
        align="center"
      >
        {title}
      </Typography>

      {fields.map(({ value, errorMessage, onChange, label, type, size }) => (
        <TextField
          fullWidth
          variant="outlined"
          key={label}
          placeholder={label}
          className={textField}
          error={errorMessage ? true : false}
          helperText={errorMessage}
          value={value || ""}
          type={type}
          onChange={(e) => onChange(e.target.value)}
          size={size}
        />
      ))}

      <Button
        onClick={onSubmit}
        className={button}
        variant="contained"
        color="primary"
        size="large"
      >
        {submitButtonName}
      </Button>

      {footer}
    </Paper>
  );
};

export default InitialPageForm;
