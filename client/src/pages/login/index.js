import React, { useState, useEffect } from "react";
import useSnackbar from "../../common/useSnackbar";
import LoginForm from "./LoginForm";

const Login = () => {
  const [email, setEmail] = useState(null);
  const [emailError, setEmailError] = useState(null);

  const [password, setPassword] = useState(null);
  const [passwordError, setPasswordError] = useState(null);

  const showSnackbar = useSnackbar();

  //Validate the email every change
  useEffect(() => {
    //Check null initial value to avoid showing errors on first render
    if (email !== null) {
      setEmailError(validateEmail());
    }
  }, [email]);

  //Validate the password every change
  useEffect(() => {
    //Check null initial value to avoid showing errors on first render
    if (password !== null) {
      setPasswordError(validatePassword());
    }
  }, [password]);

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
    } else {
      return null;
    }
  };

  //Submit form
  const login = () => {
    let passwordErrorMessage = validatePassword();
    let emailErrorMessage = validateEmail();
    if (!passwordErrorMessage && !emailErrorMessage) {
      //TODO submit the form
    } else {
      //Display all errors
    }
  };

  return (
    <>
      <LoginForm
        fields={[
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
          }
        ]}
        login={login}
      />
    </>
  );
};

export default Login;