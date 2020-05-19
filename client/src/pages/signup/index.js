import React, { useState, useEffect } from "react";
import useSnackbar from "../../common/useSnackbar";
import SignupForm from "./SignupForm";

const Signup = () => {
  const [name, setName] = useState(null);
  const [nameError, setNameError] = useState(null);

  const [email, setEmail] = useState(null);
  const [emailError, setEmailError] = useState(null);

  const [password, setPassword] = useState(null);
  const [passwordError, setPasswordError] = useState(null);

  const [confirmPassword, setConfirmPassword] = useState(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState(null);

  const { showErrorSnackbar } = useSnackbar();

  //Validate the name every change
  useEffect(() => {
    //Check null initial value to avoid showing errors on first render
    if (name !== null) {
      setNameError(validateName());
    }
  }, [name]);

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
    if (confirmPasswordError !== null) {
      setConfirmPasswordError(validateConfirmPassword());
    }
  }, [password, confirmPassword]);

  //Name Validation
  const validateName = () => {
    if (!name) {
      return "Name is required";
    } else if (name.length > 30) {
      return "Name must not exceed 30 characters";
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
    let nameErrorMessage = validateName();
    let emailErrorMessage = validateEmail();
    let passwordErrorMessage = validatePassword();
    let confirmPasswordErrorMessage = validateConfirmPassword();
    if (
      !nameErrorMessage &&
      !emailErrorMessage &&
      !passwordErrorMessage &&
      !confirmPasswordErrorMessage
    ) {
      //TODO submit the form
    } else {
      //Display all errors
      setNameError(nameErrorMessage);
      setEmailError(emailErrorMessage);
      setPasswordError(passwordErrorMessage);
      setConfirmPasswordError(confirmPasswordErrorMessage);
    }
  };

  return (
    <SignupForm
      fields={[
        {
          value: name,
          errorMessage: nameError,
          onChange: setName,
          label: "Name",
          type: "text"
        },
        {
          value: email,
          errorMessage: emailError,
          onChange: setEmail,
          label: "Email",
          type: "text"
        },
        {
          value: password,
          errorMessage: passwordError,
          onChange: setPassword,
          label: "Password",
          type: "password"
        },
        {
          value: confirmPassword,
          errorMessage: confirmPasswordError,
          onChange: setConfirmPassword,
          label: "Confirm Password",
          type: "password"
        }
      ]}
      signup={signup}
    />
  );
};

export default Signup;
