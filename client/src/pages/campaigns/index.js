import React, { useEffect, useState } from "react";
import withAuth from "common/withAuth";
import Drawer from "common/Drawer";
import axios from "axios";
import { campaign } from "constants/routes";

//TODO campaigns page
const Campaigns = () => {
  const [campaignsData, setCampaignsData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    axios.get("/api/campaign").then((response) => {
      setCampaignsData(response.data);
    });
  }, []);

  useEffect(() => {
    setFilteredData(campaignsData);
  }, [campaignsData]);

  return (
    <Drawer>
      <h1>Hello</h1>
    </Drawer>
  );
};

export default withAuth(Campaigns);
