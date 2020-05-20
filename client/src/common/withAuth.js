import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "./AuthProvider";
import { Redirect } from "react-router";

const withAuth = (Component, shouldRedirectToLogin = true) => {
  const HighOrderComponent = (props) => {
    const {
      isAuthenticated,
      setIsAuthenticated,
      user,
      setUser,
      logout
    } = useContext(AuthContext);

    useEffect(() => {
      //Fetch get user info
      //401 logs out
    }, []);

    if (isAuthenticated || !shouldRedirectToLogin) {
      return (
        <Component
          {...props}
          isAuthenticated={isAuthenticated}
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
