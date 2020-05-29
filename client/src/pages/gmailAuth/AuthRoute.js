import React from "react";
import axios from "axios";
import queryString from "query-string";
import withAuth from "common/withAuth";
import useSnackbar from "common/useSnackbar";

// A Route that responds when OAuth redirects the user back to our application

const Auth = (props) => {
  const showSnackBar = useSnackbar();

  React.useEffect(() => {
    const checkAuth = async () => {
      try {
        const value = queryString.parse(props.location.search);
        const res = await axios.post("/gmail/token", { code: value.code });
        if (res.data.message) {
          showSnackBar("Authorization Success");
          props.history.push("/");
        }
      } catch (error) {
        showSnackBar("Failed to Authenticate");
      }
    };
    checkAuth();
  }, [props.history, props.location.search, showSnackBar]);

  return <div>{props.history.push("/")}</div>;
};

export default Auth;
