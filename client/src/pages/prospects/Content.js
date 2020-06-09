import React from "react";
import Table from "common/Table";
import {
  makeStyles,
  TableRow,
  TableCell,
  Grid,
  Typography,
  IconButton,
  CircularProgress,
  Button,
} from "@material-ui/core";
import {
  Mail as MailIcon,
  FlashOn as FlashIcon,
  CheckBoxOutlineBlankRounded,
  CheckBoxRounded,
  CheckBoxTwoTone,
} from "@material-ui/icons";
import AddProspectsDialog from "./AddProspectsDialog";

const useStyles = makeStyles((theme) => ({
  header: {
    marginBottom: "1rem",
  },
  iconButton: {
    color: theme.palette.grey[400],
    marginRight: "1rem",
  },
  filterSearch: {
    marginTop: theme.spacing(2),
  },
  tableRow: {
    textDecoration: "none",
  },
  tableRowSelected: {
    background: theme.palette.action.hover,
  },
  flexRoot: {
    display: "flex",
    alignItems: "center",
  },
  smallMarginLeft: {
    marginLeft: theme.spacing(2),
  },
}));

const Content = ({ filteredData, isDataLoading, history }) => {
  const {
    header,
    iconButton,
    tableRow,
    tableRowSelected,
    flexRoot,
    smallMarginLeft,
  } = useStyles();
  const [selectedProspects, setSelectedProspects] = React.useState(new Set([]));
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const handleProspectSelection = (id) => {
    if (selectedProspects.has(id)) {
      const newSet = new Set(selectedProspects);
      newSet.delete(id);
      setSelectedProspects(newSet);
    } else {
      const newSelection = new Set([...selectedProspects]);
      newSelection.add(parseInt(id, 10));
      setSelectedProspects(newSelection);
    }
  };

  const handleSelectAll = () => {
    if (selectedProspects.size === filteredData.length) {
      setSelectedProspects(new Set([]));
    } else {
      const newSelection = new Set([]);
      filteredData.forEach((data) => {
        newSelection.add(data.id);
      });
      setSelectedProspects(newSelection);
    }
  };

  const SelectorComponent = () => {
    return (
      <div className={flexRoot}>
        <div className={smallMarginLeft}>
          {`${selectedProspects.size} of ${filteredData.length} selected`}
        </div>
        <Button
          className={smallMarginLeft}
          size="small"
          variant="outlined"
          color="primary"
          onClick={() => setIsDialogOpen(true)}
        >
          Add Prospects
        </Button>
      </div>
    );
  };

  return (
    <>
      <Grid className={header} container>
        <Grid item xs={true}>
          <Typography variant="h4">Prospects</Typography>
        </Grid>
        <Grid>
          <IconButton className={iconButton}>
            <FlashIcon />
          </IconButton>
          <IconButton className={iconButton}>
            <MailIcon />
          </IconButton>
        </Grid>
        <Grid>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => {
              history.push("/prospects/import");
            }}
          >
            Import Prospects
          </Button>
        </Grid>
      </Grid>
      {isDataLoading ? (
        <Grid container justify="center">
          <CircularProgress />
        </Grid>
      ) : (
        <Table
          SelectorComponent={
            selectedProspects.size > 0 ? <SelectorComponent /> : null
          }
          data={filteredData}
          renderRowHeader={(data) => (
            <TableRow>
              <TableCell variant="head" onClick={handleSelectAll}>
                {selectedProspects.size > 0 ? (
                  <CheckBoxTwoTone />
                ) : (
                  <CheckBoxOutlineBlankRounded />
                )}
              </TableCell>
              <TableCell variant="head">Email</TableCell>
              <TableCell variant="head">Status</TableCell>
              <TableCell variant="head">First Name</TableCell>
              <TableCell variant="head">Last Name</TableCell>
            </TableRow>
          )}
          renderRowData={(data, index) => (
            <TableRow
              onClick={() => {
                handleProspectSelection(data.id);
              }}
              className={
                selectedProspects.has(data.id) ? tableRowSelected : tableRow
              }
              key={data.id}
              hover
            >
              <TableCell>
                {selectedProspects.has(data.id) ? (
                  <CheckBoxRounded color="primary" />
                ) : (
                  index + 1
                )}
              </TableCell>
              <TableCell>{data.email}</TableCell>
              <TableCell>{data.status}</TableCell>
              <TableCell>{data.firstName}</TableCell>
              <TableCell>{data.lastName}</TableCell>
            </TableRow>
          )}
        />
      )}
      <AddProspectsDialog
        selectedProspects={selectedProspects}
        isOpen={isDialogOpen}
        handleClose={() => setIsDialogOpen(!isDialogOpen)}
      />
    </>
  );
};

export default Content;
