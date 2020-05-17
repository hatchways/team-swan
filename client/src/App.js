import React from "react";
import MainLayout from "./pages/mainlayout";
import LandingPage from "./pages/Landing";
import { Route } from "react-router-dom";
import Login from "./pages/login";

function App() {
  return (
    <MainLayout>
      <Route path="/" component={Login} />
    </MainLayout>
  );
}

export default App;
