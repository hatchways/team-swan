import React, { useEffect, useState } from "react";
import withAuth from "common/withAuth";
import Drawer from "common/Drawer";
import axios from "axios";
import Table from "common/Table";
import {
  makeStyles,
  TableRow,
  TableCell,
  Grid,
  Typography,
  IconButton,
  Button,
  InputAdornment,
  Container,
  FormControl,
  OutlinedInput,
  InputLabel,
} from "@material-ui/core";
import {
  Mail as MailIcon,
  FlashOn as FlashIcon,
  SearchOutlined as SearchOutlinedIcon,
} from "@material-ui/icons";
import moment from "moment";
import CreateCampaignDialog from "./CreateCampaignDialog";
import useSnackbar from "common/useSnackbar";

const useStyles = makeStyles((theme) => ({
  header: {
    marginBottom: "1rem",
  },
  iconButton: {
    color: theme.palette.grey[400],
    marginRight: "1rem",
  },
  button: {
    marginLeft: "1rem",
    width: "10rem",
  },
  filterSearch: {
    marginTop: theme.spacing(2),
  },
}));

const Campaigns = () => {
  const [campaignsData, setCampaignsData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [campaignNameTextField, setCampaignNameTextField] = useState("");
  const [searchCampaignName, setSearchCampaignName] = useState("");

  const { header, iconButton, button, filterSearch } = useStyles();
  const showSnackbar = useSnackbar();

  useEffect(() => {
    getCampaigns();
  }, []);

  useEffect(() => {
    const newFilteredData = campaignsData.filter((data) =>
      data.name.includes(searchCampaignName)
    );
    setFilteredData(newFilteredData);
  }, [campaignsData, searchCampaignName]);

  const getCampaigns = () => {
    axios.get("/api/campaign").then((response) => {
      setCampaignsData(response.data);
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
    <Drawer
      LeftDrawerComponent={
        <Container>
          <FormControl fullWidth className={filterSearch} variant="outlined">
            <InputLabel htmlFor="outlined-adornment-email">Search</InputLabel>
            <OutlinedInput
              autoComplete={"off"}
              id="outlined-adornment-amount"
              value={searchCampaignName}
              onChange={(e) => setSearchCampaignName(e.target.value)}
              startAdornment={
                <InputAdornment position="start">
                  <SearchOutlinedIcon></SearchOutlinedIcon>
                </InputAdornment>
              }
              labelWidth={60}
            />
          </FormControl>
        </Container>
      }
    >
      <Grid className={header} container>
        <Grid item xs={true}>
          <Typography variant="h4">Campaigns</Typography>
        </Grid>
        <Grid>
          <IconButton className={iconButton}>
            <FlashIcon />
          </IconButton>
          <IconButton className={iconButton}>
            <MailIcon />
          </IconButton>
          <Button
            variant="contained"
            color="primary"
            size="large"
            className={button}
            onClick={() => setIsCreateDialogOpen(true)}
          >
            Create Campaign
          </Button>
        </Grid>
      </Grid>

      <Table
        data={filteredData}
        renderRowHeader={(data) => (
          <TableRow>
            <TableCell variant="head">Name</TableCell>
            <TableCell variant="head">Created</TableCell>
          </TableRow>
        )}
        renderRowData={(data) => (
          <TableRow>
            <TableCell>{data.name}</TableCell>
            <TableCell>{moment(data.createdAt).format("MMM d")}</TableCell>
          </TableRow>
        )}
      />

      <CreateCampaignDialog
        open={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSubmit={createCampaign}
        campaignNameTextField={campaignNameTextField}
        setCampaignNameTextField={setCampaignNameTextField}
      />
    </Drawer>
  );
};

export default withAuth(Campaigns);
