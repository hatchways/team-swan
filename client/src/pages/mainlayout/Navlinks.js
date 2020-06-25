import React, { useEffect, useState } from "react";
import { Tabs, Tab, makeStyles } from "@material-ui/core";
import { useLocation, useRouteMatch, Link } from "react-router-dom";
import { campaigns, prospects, templates, reporting } from "constants/routes";

//CSS styles
const useStyles = makeStyles((theme) => ({
  tabContainer: {
    marginRight: "10rem",
  },
  tab: {
    height: "6rem",
    padding: "10px",
    color: "black",
  },
  indicator: {
    display: "flex",
    justifyContent: "center",
    height: "5px",
    top: 0,
    backgroundColor: "transparent",
    "& div": {
      maxWidth: 100,
      width: "100%",
      backgroundColor: theme.palette.primary.main,
    },
  },
}));

const links = [
  { label: "Campaigns", to: campaigns, value: "campaigns" },
  { label: "Prospects", to: prospects, value: "prospects" },
  { label: "Templates", to: templates, value: "templates" },
  { label: "Reporting", to: reporting, value: "reporting" },
];

const Navlinks = () => {
  const [tabValue, setTabValue] = useState("");

  const { tab, indicator, tabContainer } = useStyles();
  const location = useLocation();

  useEffect(() => {
    const splitPathName = location.pathname.split("/");
    const rootPathName = splitPathName[1];

    if (
      ["campaigns", "prospects", "templates", "reporting"].includes(
        rootPathName
      )
    ) {
      setTabValue(rootPathName);
    } else {
      setTabValue("");
    }
  }, [location.pathname]);

  return (
    <Tabs
      centered
      className={tabContainer}
      value={tabValue}
      indicatorColor="primary"
      textColor="primary"
      TabIndicatorProps={{
        children: <div></div>,
        className: indicator,
      }}
    >
      {links.map((link) => (
        <Tab
          {...link}
          disableRipple
          key={link.label}
          component={Link}
          className={tab}
        />
      ))}
    </Tabs>
  );
};

export default Navlinks;
