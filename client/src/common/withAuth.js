import React, { useContext, useEffect } from "react";
import { AuthContext } from "./AuthProvider";
import { Redirect } from "react-router";

const withAuth = (Component, shouldRedirectToLogin = true) => {
  const HighOrderComponent = (props) => {
    const { user, validateAuthCookie, logout, socket } = useContext(
      AuthContext
    );

    useEffect(() => {
      validateAuthCookie();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (user || !shouldRedirectToLogin) {
      return (
        <Component
          {...props}
          isAuthenticated={user ? true : false}
          user={user}
          logout={logout}
          socket={socket}
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
