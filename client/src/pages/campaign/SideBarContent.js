import React, { useState, useEffect } from "react";
import {
  makeStyles,
  Container,
  FormGroup,
  FormControlLabel,
  Switch,
  Tabs,
  Tab,
} from "@material-ui/core";
import { FiberManualRecord as FiberManualRecordIcon } from "@material-ui/icons";
import { Link, useLocation, useParams } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  tabsContainer: {
    "& .MuiTab-root": {
      textAlign: "left",
      marginTop: "1rem",
    },
    "& .MuiTab-wrapper": {
      display: "inline",
    },
  },
  indicator: {
    backgroundColor: "transparent",
  },
  tabRoot: {
    color: "black",
    minHeight: "1.5rem !important",
    "& .MuiTab-wrapper": {
      "& svg": {
        fontSize: "0",
      },
    },
  },
  tabSelected: {
    background:
      "linear-gradient(99deg, rgba(42,168,151,1) 10%, rgba(79,190,117,1) 100%)",
    borderRadius: "10px",
    "& .MuiTab-wrapper": {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      justifyContent: "center",
      color: "white",
      "& svg": {
        fontSize: "10px",
        margin: "0 10px 0 0 !important",
      },
      "& span": {
        flexGrow: 1,
      },
    },
  },
}));

const SideBarContent = () => {
  const [tabValue, setTabValue] = useState("");

  const { tabsContainer, tabRoot, indicator, tabSelected } = useStyles();
  const location = useLocation();
  const params = useParams();

  const links = [
    { label: <span>SUMMARY</span>, to: `/campaigns/${params.id}`, value: "" },
    {
      label: <span>PROSPECTS</span>,
      to: `/campaigns/${params.id}/prospects`,
      value: "prospects",
    },
  ];

  useEffect(() => {
    const splitPathName = location.pathname.split("/");
    const lastPathName = splitPathName[splitPathName.length - 1];
    if (["emails", "prospects"].includes(lastPathName)) {
      setTabValue(lastPathName);
    } else {
      setTabValue("");
    }
  }, [location.pathname]);

  return (
    <Container>
      <Tabs
        className={tabsContainer}
        orientation="vertical"
        indicatorColor="primary"
        textColor="primary"
        value={tabValue}
        TabIndicatorProps={{
          className: indicator,
        }}
      >
        {links.map((link) => (
          <Tab
            {...link}
            disableRipple
            key={link.label}
            component={Link}
            classes={{ selected: tabSelected, root: tabRoot }}
            icon={<FiberManualRecordIcon fontSize="small" />}
          />
        ))}
      </Tabs>
    </Container>
  );
};

export default SideBarContent;
