import React from "react";
import { Tabs, Tab, makeStyles } from "@material-ui/core";
import { useLocation, Link } from "react-router-dom";

//CSS styles
const useStyles = makeStyles({
  tabContainer: {
    marginRight: "10rem"
  },
  tab: {
    height: "6rem",
    color: "black"
  },
  tabScrollButton: {
    height: "5px",
    top: 0
  }
});

const Navlinks = () => {
  const { tab, tabScrollButton, tabContainer } = useStyles();
  const location = useLocation();

  const links = [
    { label: "Campaigns", to: "/campaign" },
    { label: "Prospects", to: "/prospects" },
    { label: "Templates", to: "/templates" },
    { label: "Reporting", to: "/reporting" }
  ];

  return (
    <Tabs
      centered
      className={tabContainer}
      value={location.pathname}
      indicatorColor="primary"
      textColor="primary"
      TabIndicatorProps={{ className: tabScrollButton }}
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
