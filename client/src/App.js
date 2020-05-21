import React, { useEffect } from "react";
import MainLayout from "./pages/mainlayout";
import { Route, Switch, Redirect } from "react-router-dom";
import Login from "./pages/login";
import Signup from "./pages/signup";
import withAuth from "common/withAuth";
import Campaigns from "./pages/campaigns";
import Prospects from "./pages/prospects";
import Templates from "./pages/templates";
import Reporting from "./pages/reporting";

function App({ isAuthenticated }) {
  return (
    <MainLayout>
      <Switch>
        <Route path="/prospects" component={Prospects} />
        <Route path="/campaigns" component={Campaigns} />
        <Route path="/reporting" component={Reporting} />
        <Route path="/templates" component={Templates} />
        <Route
          path="/login"
          render={(props) =>
            isAuthenticated ? (
              <Redirect to="/campaigns" />
            ) : (
              <Login {...props} />
            )
          }
        />
        <Route
          path="/"
          render={(props) =>
            isAuthenticated ? (
              <Redirect to="/campaigns" />
            ) : (
              <Signup {...props} />
            )
          }
        />
      </Switch>
    </MainLayout>
  );
}

export default withAuth(App, false);
