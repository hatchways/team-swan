import React from "react";
import { Container } from "@material-ui/core";
import SearchBar from "common/SearchBar";

const SideBarContent = ({ searchCampaignName, setSearchCampaignName }) => {
  return (
    <Container>
      <SearchBar
        searchText={searchCampaignName}
        setSearchText={setSearchCampaignName}
      ></SearchBar>
    </Container>
  );
};

export default SideBarContent;
