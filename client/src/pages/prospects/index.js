import React, { useState, useEffect } from "react";
import withAuth from "common/withAuth";
import Drawer from "common/Drawer";
import axios from "axios";
import { Container, Grid, Typography, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import useSnackbar from "common/useSnackbar";
import SideBarContent from "./SideBarContent";
import Content from "./Content";

const useStyles = makeStyles((theme) => ({
  rootContainer: {
    margin: "1rem",
  },
  gridElement: {
    padding: "0.75rem;",
  },
}));

const Prospects = (props) => {
  const classes = useStyles();
  const id = props.user.id;
  const [prospectsData, setProspectsData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchField, setSearchField] = useState("email");
  const [isDataLoading, setIsDataLoading] = useState(true);

  const showSnackbar = useSnackbar();

  useEffect(() => {
    setIsDataLoading(true);
    if (props.user.id) {
      axios.get(`/api/user/${id}/prospects`).then((response) => {
        setProspectsData(response.data);
        setFilteredData(response.data);
        setIsDataLoading(false);
      });
    }
  }, [id, props.user.id]);

  useEffect(() => {
    const newFilteredData = prospectsData.filter((data) =>
      data[searchField].toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredData(newFilteredData);
  }, [prospectsData, searchField, searchText]);

  return (
    <>
      <Drawer
        LeftDrawerComponent={
          <SideBarContent
            searchProspectText={searchText}
            setSearchProspectText={setSearchText}
            searchField={searchField}
            setSearchField={setSearchField}
          />
        }
        RightDrawerComponent={
          <Content
            isDataLoading={isDataLoading}
            history={props.history}
            filteredData={filteredData}
          />
        }
      />
    </>
  );
};

export default withAuth(Prospects);
