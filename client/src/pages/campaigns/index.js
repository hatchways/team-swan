import React, { useEffect, useState } from "react";
import withAuth from "common/withAuth";
import Drawer from "common/Drawer";
import axios from "axios";
import CreateCampaignDialog from "./CreateCampaignDialog";
import useSnackbar from "common/useSnackbar";
import SideBarContent from "./SideBarContent";
import Content from "./Content";

const Campaigns = () => {
  const [campaignsData, setCampaignsData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [campaignNameTextField, setCampaignNameTextField] = useState("");
  const [searchCampaignName, setSearchCampaignName] = useState("");
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [filterTabValue, setFilterTabValue] = useState("allCampaigns");

  const showSnackbar = useSnackbar();

  useEffect(() => {
    getCampaigns();
  }, []);

  useEffect(() => {
    const newFilteredData = campaignsData.filter((data) => {
      let included = data.name
        .toLowerCase()
        .includes(searchCampaignName.toLowerCase());

      if (filterTabValue === "activeProspects" && included) {
        included = data.activeCount > 0;
      } else if (filterTabValue === "pendingProspects" && included) {
        included = data.pendingCount > 0;
      }

      return included;
    });

    setFilteredData(newFilteredData);
  }, [campaignsData, searchCampaignName, filterTabValue]);

  const getCampaigns = () => {
    setIsDataLoading(true);
    axios.get("/api/campaign").then((response) => {
      setCampaignsData(response.data);
      setFilteredData(response.data);
      setIsDataLoading(false);
    });
  };

  const createCampaign = () => {
    axios
      .post("/api/campaign", { name: campaignNameTextField })
      .then((response) => {
        getCampaigns();
        setIsCreateDialogOpen(false);
        showSnackbar("Campaign successfully created", "success");
      });
  };

  return (
    <>
      <Drawer
        LeftDrawerComponent={
          <SideBarContent
            key="sidebar"
            searchCampaignName={searchCampaignName}
            setSearchCampaignName={setSearchCampaignName}
            filterTabValue={filterTabValue}
            setFilterTabValue={setFilterTabValue}
          />
        }
        RightDrawerComponent={
          <Content
            key="content"
            openCreateCampaignDialog={() => setIsCreateDialogOpen(true)}
            filteredData={filteredData}
            isDataLoading={isDataLoading}
          />
        }
      />
      <CreateCampaignDialog
        open={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSubmit={createCampaign}
        campaignNameTextField={campaignNameTextField}
        setCampaignNameTextField={setCampaignNameTextField}
      />
    </>
  );
};

export default withAuth(Campaigns);
