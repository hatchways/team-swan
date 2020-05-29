import React, { useEffect } from "react";
import MainLayout from "./pages/mainlayout";
import { Route, Switch, Redirect } from "react-router-dom";
import Login from "./pages/login";
import Signup from "./pages/signup";
import withAuth from "common/withAuth";
import Campaigns from "./pages/campaigns";
import Campaign from "./pages/campaigns";
import Prospects from "./pages/prospects";
import Templates from "./pages/templates";
import Reporting from "./pages/reporting";
import {
  campaigns,
  campaign,
  prospects,
  templates,
  reporting,
  importProspects,
} from "constants/routes";
import ImportProspects from "./pages/importProspects";
import AuthRoute from "pages/gmailAuth/AuthRoute";
import Gmail from "pages/gmailAuth/Gmail";

function App({ isAuthenticated }) {
  return (
    <MainLayout>
      <Switch>
        <Route path="/gmailauth" component={AuthRoute}></Route>
        <Route path={importProspects} component={ImportProspects} />
        <Route path={prospects} component={Prospects}></Route>
        <Route path={campaign} component={Campaign} />
        <Route path={campaigns} component={Campaigns} />
        <Route path={reporting} component={Reporting} />
        <Route path={templates} component={Templates} />

        <Route
          path="/login"
          render={(props) =>
            isAuthenticated ? <Redirect to={campaigns} /> : <Login {...props} />
          }
        />
        <Route
          path="/"
          render={(props) =>
            isAuthenticated ? (
              <Redirect to={campaigns} />
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
