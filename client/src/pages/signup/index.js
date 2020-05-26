import React, { useState, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Typography, Link } from "@material-ui/core";
import useSnackbar from "common/useSnackbar";
import PaperForm from "common/PaperForm";
import axios from "axios";
import withAuth from "common/withAuth";

const Signup = ({ validateAuthCookie }) => {
  const [firstName, setFirstName] = useState(null);
  const [firstNameError, setFirstNameError] = useState(null);

  const [lastName, setLastName] = useState(null);
  const [lastNameError, setLastNameError] = useState(null);

  const [email, setEmail] = useState(null);
  const [emailError, setEmailError] = useState(null);

  const [password, setPassword] = useState(null);
  const [passwordError, setPasswordError] = useState(null);

  const [confirmPassword, setConfirmPassword] = useState(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState(null);

  const showSnackbar = useSnackbar();

  //Validate the first name every change
  useEffect(() => {
    //Check null initial value to avoid showing errors on first render
    if (firstName !== null) {
      setFirstNameError(validateName(firstName, "First Name"));
    }
  }, [firstName]);

  //Validate the last name every change
  useEffect(() => {
    //Check null initial value to avoid showing errors on first render
    if (lastName !== null) {
      setLastNameError(validateName(lastName, "Last Name"));
    }
  }, [lastName]);

  //Validate the email every change
  useEffect(() => {
    //Check null initial value to avoid showing errors on first render
    if (email !== null) {
      setEmailError(validateEmail());
    }
  }, [email]);

  //Validate the password and confirm password every change
  useEffect(() => {
    //Check null initial value to avoid showing errors on first render
    if (password !== null) {
      setPasswordError(validatePassword());
    }

    //Check null initial value to avoid showing errors on first render
    if (confirmPassword !== null) {
      setConfirmPasswordError(validateConfirmPassword());
    }
  }, [password, confirmPassword]);

  //Name Validation
  const validateName = (name, label) => {
    if (!name) {
      return `${label} is required`;
    } else if (name.length > 20) {
      return `${label} must not exceed 20 characters`;
    } else {
      return null;
    }
  };

  //Email Validation
  const validateEmail = () => {
    let emailRegex = new RegExp(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/);
    if (!email) {
      return "Email is required";
    } else if (!emailRegex.test(email)) {
      return "Invalid Email";
    } else {
      return null;
    }
  };

  //Password Validation
  const validatePassword = () => {
    if (!password) {
      return "Password is required";
    } else if (password.length < 6) {
      return "Password must have at least 6 characters";
    } else {
      return null;
    }
  };

  //Confirm Password Validation
  const validateConfirmPassword = () => {
    if (confirmPassword !== password) {
      return "Passwords do not match";
    } else {
      return null;
    }
  };

  //Submit form
  const signup = () => {
    let firstNameErrorMessage = validateName(firstName, "First Name");
    let lastNameErrorMessage = validateName(lastName, "Last Name");
    let emailErrorMessage = validateEmail();
    let passwordErrorMessage = validatePassword();
    let confirmPasswordErrorMessage = validateConfirmPassword();
    if (
      !firstNameErrorMessage &&
      !lastNameErrorMessage &&
      !emailErrorMessage &&
      !passwordErrorMessage &&
      !confirmPasswordErrorMessage
    ) {
      axios
        .post("/api/signup", { firstName, lastName, email, password })
        .then((response) => {
          validateAuthCookie();
        })
        .catch((error) => {
          showSnackbar(error.response.data.errors[0].message, "error");
        });
    } else {
      //Display all errors
      setFirstNameError(firstNameErrorMessage);
      setLastNameError(lastNameErrorMessage);
      setEmailError(emailErrorMessage);
      setPasswordError(passwordErrorMessage);
      setConfirmPasswordError(confirmPasswordErrorMessage);
    }
  };

  return (
    <PaperForm
      fields={[
        {
          value: firstName,
          errorMessage: firstNameError,
          onChange: setFirstName,
          label: "First Name",
          type: "text",
          size: "small"
        },
        {
          value: lastName,
          errorMessage: lastNameError,
          onChange: setLastName,
          label: "Last Name",
          type: "text",
          size: "small"
        },
        {
          value: email,
          errorMessage: emailError,
          onChange: setEmail,
          label: "Email",
          type: "text",
          size: "small"
        },
        {
          value: password,
          errorMessage: passwordError,
          onChange: setPassword,
          label: "Password",
          type: "password",
          size: "small"
        },
        {
          value: confirmPassword,
          errorMessage: confirmPasswordError,
          onChange: setConfirmPassword,
          label: "Confirm Password",
          type: "password",
          size: "small"
        }
      ]}
      title="Sign up"
      onSubmit={signup}
      submitButtonName="Sign up"
      footer={
        <Typography variant="body2">
          Already have an account?{" "}
          <Link href="#" component={RouterLink} to="/login">
            Sign in
          </Link>
        </Typography>
      }
    />
  );
};

export default withAuth(Signup, false);
