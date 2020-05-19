import React, { useState, useEffect } from "react";
import useSnackbar from "../../common/useSnackbar";
import LoginForm from "./LoginForm";

const Login = () => {
  const [email, setEmail] = useState(null);
  const [emailError, setEmailError] = useState(null);

  const [password, setPassword] = useState(null);
  const [passwordError, setPasswordError] = useState(null);

  //Utility hooks
  const { showErrorSnackbar } = useSnackbar();

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
    } else {
      setPasswordError(null);
      return true;
    }
  };

  //Submit form
  const login = () => {
    if (validateEmail() && validatePassword()) {
      //TODO submit the form
    }
  };

  return (
    <LoginForm
      fields={[
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
        }
      ]}
      login={login}
    />
  );
};

export default Login;
