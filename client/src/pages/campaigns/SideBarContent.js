import React from "react";
import { Container, Tabs, Tab, makeStyles } from "@material-ui/core";
import SearchBar from "common/SearchBar";

const useStyles = makeStyles((theme) => ({
  tabsContainer: {
    marginTop: "1rem",
    "& .MuiTab-wrapper": {
      display: "inline",
    },
  },
  indicator: {
    backgroundColor: "transparent",
  },
  tabRoot: {
    color: "black",
    minHeight: "3rem !important",
    textAlign: "left",
    paddingLeft: "0 !important",
  },
}));

const tabs = [
  { label: "All Campaigns", value: "allCampaigns" },
  { label: "Active Prospects", value: "activeProspects" },
  { label: "Pending Prospects", value: "pendingProspects" },
];

const SideBarContent = ({
  searchCampaignName,
  setSearchCampaignName,
  filterTabValue,
  setFilterTabValue,
}) => {
  const { tabsContainer, tabRoot, indicator } = useStyles();

  const tabsOnChangeHandler = (event, value) => {
    setFilterTabValue(value);
  };

  return (
    <Container>
      <SearchBar
        searchText={searchCampaignName}
        setSearchText={setSearchCampaignName}
      ></SearchBar>

      <Tabs
        className={tabsContainer}
        orientation="vertical"
        indicatorColor="primary"
        textColor="primary"
        value={filterTabValue}
        TabIndicatorProps={{
          className: indicator,
        }}
        onChange={tabsOnChangeHandler}
      >
        {tabs.map((tab) => (
          <Tab
            {...tab}
            disableRipple
            key={tab.label}
            classes={{ root: tabRoot }}
          />
        ))}
      </Tabs>
    </Container>
  );
};

export default SideBarContent;
