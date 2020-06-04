import React from "react";
import withAuth from "common/withAuth";
import Table from "common/Table";
import {
  makeStyles,
  TableRow,
  TableCell,
  Grid,
  Typography,
  IconButton,
  Button,
  CircularProgress,
} from "@material-ui/core";
import { Mail as MailIcon, FlashOn as FlashIcon } from "@material-ui/icons";
import moment from "moment";
import { Link } from "react-router-dom";

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
  tableRow: {
    textDecoration: "none",
  },
}));

const Campaigns = ({
  openCreateCampaignDialog,
  filteredData,
  isDataLoading,
}) => {
  const { header, iconButton, button, tableRow } = useStyles();

  return (
    <>
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
            onClick={openCreateCampaignDialog}
          >
            Create Campaign
          </Button>
        </Grid>
      </Grid>

      {isDataLoading ? (
        <Grid container justify="center">
          <CircularProgress />
        </Grid>
      ) : (
        <Table
          data={filteredData}
          renderRowHeader={(data) => (
            <TableRow>
              <TableCell variant="head">Name</TableCell>
              <TableCell variant="head">Created</TableCell>
            </TableRow>
          )}
          renderRowData={(data) => (
            <TableRow
              className={tableRow}
              key={data.id}
              hover
              component={Link}
              to={`/campaigns/${data.id}`}
            >
              <TableCell>{data.name}</TableCell>
              <TableCell>{moment(data.createdAt).format("MMM d")}</TableCell>
            </TableRow>
          )}
        />
      )}
    </>
  );
};

export default Campaigns;
