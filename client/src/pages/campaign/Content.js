import React from "react";
import { Grid } from "@material-ui/core";

import { Route, Switch } from "react-router-dom";
import SummaryPage from "./SummaryPage";

const Content = () => {
  return (
    <Grid container>
      <Switch>
        <Route
          path="/campaigns/:id/emails"
          component={() => <div>Emails</div>}
        />
        <Route
          path="/campaigns/:id/prospects"
          component={() => <div>Prospects</div>}
        />
        <Route path="/campaigns/:id" component={SummaryPage} />
      </Switch>
    </Grid>
  );
};

export default Content;
