import React, { useContext, useEffect } from "react";
import { AuthContext } from "./AuthProvider";
import { Redirect } from "react-router";

const withAuth = (Component, shouldRedirectToLogin = true) => {
  const HighOrderComponent = (props) => {
    const { user, validateAuthCookie, logout, isAuthenticated } = useContext(
      AuthContext
    );

    useEffect(() => {
      validateAuthCookie();
    }, []);

    if (user || !shouldRedirectToLogin) {
      return (
        <Component
          {...props}
          isAuthenticated={user ? true : false}
          user={user}
          logout={logout}
          validateAuthCookie={validateAuthCookie}
        />
      );
    } else {
      return <Redirect to="/login" />;
    }
  };

  return HighOrderComponent;
};

export default withAuth;
