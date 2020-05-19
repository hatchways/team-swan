import React from "react";
import MainLayout from "./pages/mainlayout";
import { Route, Switch } from "react-router-dom";
import Login from "./pages/login";
import Signup from "./pages/signup";

function App() {
  return (
    <MainLayout>
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/" component={Signup} />
      </Switch>
    </MainLayout>
  );
}

export default App;
