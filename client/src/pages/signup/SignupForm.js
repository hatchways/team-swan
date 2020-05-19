import React from "react";
import {
  TextField,
  Paper,
  Typography,
  makeStyles,
  Button,
  Link
} from "@material-ui/core";
import { Link as RouterLink } from "react-router-dom";

//CSS styles
const useStyles = makeStyles({
  container: {
    width: "490px",
    height: "500px",
    margin: "40px auto 0 auto",
    padding: "2rem 4rem 2rem 4rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  title: {
    marginBottom: "20px"
  },
  buttonContainer: {
    flexGrow: 1
  },
  button: {
    width: "10rem",
    margin: "1rem"
  },
  textField: {
    marginTop: "10px"
  }
});

const SignupForm = ({ fields, signup }) => {
  const { container, buttonContainer, button, textField, title } = useStyles();

  return (
    <Paper className={container} elevation={3} spacing={2}>
      <Typography className={title} variant="h4" display="block" align="center">
        Sign up
      </Typography>

      {fields.map(({ value, errorMessage, onChange, label, type }) => (
        <TextField
          fullWidth
          variant="outlined"
          size="small"
          key={label}
          placeholder={label}
          className={textField}
          error={errorMessage ? true : false}
          helperText={errorMessage}
          value={value || ""}
          type={type}
          onChange={(e) => onChange(e.target.value)}
        />
      ))}

      <div className={buttonContainer}>
        <Button
          onClick={signup}
          className={button}
          variant="contained"
          color="primary"
          size="large"
        >
          Sign up
        </Button>
      </div>

      <Typography variant="body2">
        Already have an account?{" "}
        <Link href="#" component={RouterLink} to="/login">
          Sign in
        </Link>
      </Typography>
    </Paper>
  );
};

export default SignupForm;
