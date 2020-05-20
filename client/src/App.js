import React from "react";
import MainLayout from "./pages/mainlayout";
import { Route, Switch, Redirect } from "react-router-dom";
import Login from "./pages/login";
import Signup from "./pages/signup";
import withAuth from "common/withAuth";

function App({ isAuthenticated }) {
  return (
    <MainLayout>
      <Switch>
        {isAuthenticated ? (
          <Redirect to="/campaigns" />
        ) : (
          <>
            <Route exact path="/login" render={Login} />
            <Route exact path="/" component={Signup} />
          </>
        )}
      </Switch>
    </MainLayout>
  );
}

export default withAuth(App, false);
