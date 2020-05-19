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
      validateName();
    }
  }, [name]);

  //Validate the email every change
  useEffect(() => {
    //Check null initial value to avoid showing errors on first render
    if (email !== null) {
      validateEmail();
    }
  }, [email]);

  //Validate the password every change
  useEffect(() => {
    //Check null initial value to avoid showing errors on first render
    if (password !== null) {
      validatePassword();
    }
  }, [password]);

  //Validate the password and confirm password every change
  useEffect(() => {
    //Check null initial value to avoid showing errors on first render
    if (password !== null) {
      validatePassword();
    }

    //Check null initial value to avoid showing errors on first render
    if (password !== null) {
      validateConfirmPassword();
    }
  }, [password, confirmPassword]);

  //Name Validation
  const validateName = () => {
    if (!name) {
      setNameError("Name is required");
      return false;
    } else if (name.length > 30) {
      setNameError("Name must not exceed 30 characters");
      return false;
    } else {
      setNameError(null);
      return true;
    }
  };

  //Email Validation
  const validateEmail = () => {
    let emailRegex = new RegExp(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/);
    if (!email) {
      setEmailError("Email is required");
      return false;
    } else if (!emailRegex.test(email)) {
      setEmailError("Invalid Email");
      return false;
    } else {
      setEmailError(null);
      return true;
    }
  };

  //Password Validation
  const validatePassword = () => {
    if (!password) {
      setPasswordError("Password is required");
      return false;
    } else if (password.length < 6) {
      setPasswordError("Password must have at least 6 characters");
      return false;
    } else {
      setPasswordError(null);
      return true;
    }
  };

  //Confirm Password Validation
  const validateConfirmPassword = () => {
    if (confirmPassword !== password) {
      setConfirmPasswordError("Passwords do not match");
      return false;
    } else {
      setConfirmPasswordError(null);
      return true;
    }
  };

  //Submit form
  const signup = () => {
    if (
      validateName() &&
      validateEmail() &&
      validatePassword() &&
      validateConfirmPassword()
    ) {
      //TODO submit the form
    }
  };

  return (
    <SignupForm
      fields={[
        {
          value: name,
          error: nameError,
          onChange: setName,
          label: "Name",
          type: "text"
        },
        {
          value: email,
          error: emailError,
          onChange: setEmail,
          label: "Email",
          type: "text"
        },
        {
          value: password,
          error: passwordError,
          onChange: setPassword,
          label: "Password",
          type: "password"
        },
        {
          value: confirmPassword,
          error: confirmPasswordError,
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
