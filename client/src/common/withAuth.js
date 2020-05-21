import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "./AuthProvider";
import { Redirect } from "react-router";
import axios from "axios";

const withAuth = (Component, shouldRedirectToLogin = true) => {
  const HighOrderComponent = (props) => {
    const { user, setUser, logout } = useContext(AuthContext);

    useEffect(() => {
      axios
        .get("/api/currentuser")
        .then((response) => {
          setUser(response.data.currentUser);
        })
        .catch((error) => {
          if (error.response.status === 401) {
            setUser(null);
          }
        });
    }, []);

    if (user || !shouldRedirectToLogin) {
      return (
        <Component
          {...props}
          isAuthenticated={user ? true : false}
          user={user}
          logout={logout}
        />
      );
    } else {
      return <Redirect to="/login" />;
    }
  };

  return HighOrderComponent;
};

export default withAuth;
