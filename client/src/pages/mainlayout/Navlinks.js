import React from "react";
import { Tabs, Tab, makeStyles } from "@material-ui/core";
import { useLocation, Link } from "react-router-dom";
import { campaigns, prospects, templates, reporting } from "constants/routes";

//CSS styles
const useStyles = makeStyles((theme) => ({
  tabContainer: {
    marginRight: "10rem"
  },
  tab: {
    height: "6rem",
    padding: "10px",
    color: "black"
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
      backgroundColor: theme.palette.primary.main
    }
  }
}));

const Navlinks = () => {
  const { tab, indicator, tabContainer } = useStyles();
  const location = useLocation();

  const links = [
    { label: "Campaigns", to: campaigns },
    { label: "Prospects", to: prospects },
    { label: "Templates", to: templates },
    { label: "Reporting", to: reporting }
  ];

  return (
    <Tabs
      centered
      className={tabContainer}
      value={location.pathname}
      indicatorColor="primary"
      textColor="primary"
      TabIndicatorProps={{
        children: <div></div>,
        className: indicator
      }}
    >
      {links.map((link) => (
        <Tab
          {...link}
          disableRipple
          key={link.label}
          component={Link}
          className={tab}
          value={link.to}
        />
      ))}
    </Tabs>
  );
};

export default Navlinks;
