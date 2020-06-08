import React, { useState, useEffect } from "react";
import {
  makeStyles,
  Paper,
  Table as MaterialTable,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
  Typography,
  IconButton,
  Grid,
} from "@material-ui/core";
import { toSentenceCase } from "js-convert-case";
import { ArrowRight, ArrowLeft } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  tableContainer: {
    padding: "1rem",
    "& td, th": {
      fontWeight: "bold",
    },
    "& td": {
      borderBottom: `1px solid ${theme.palette.grey[200]}`,
    },
  },
  tableHead: {
    backgroundColor: theme.palette.primary.main,
    "& th": {
      color: "#ffffff",
      border: "none",
    },
    "& th:first-child": {
      borderRadius: "5px 0 0 5px",
    },
    "& th:last-child, ": {
      borderRadius: "0  5px 5px 0",
    },
  },
  paginationRoot: {
    flexShrink: 0,
    marginLeft: theme.spacing(2.5),
    border: "1px solid",
    borderColor: theme.palette.text.disabled,
    borderRadius: 3 + "rem",
  },
  paginationIconButton: {
    padding: 0,
    "& > *": {
      color: theme.palette.primary.light,
    },
  },
  flexRoot: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  flexRootEnd: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  flexEnd: {
    alignSelf: "flex-end",
  },
}));

const Table = ({ data, renderRowHeader, renderRowData, SelectorComponent }) => {
  const [paginatedData, setPaginatedData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const {
    tableContainer,
    tableHead,
    paginationRoot,
    paginationIconButton,
    flexRoot,
    flexRootEnd,
  } = useStyles();

  //Paginate the data
  useEffect(() => {
    const startPosition = page * rowsPerPage;
    const endPosition = page * rowsPerPage + rowsPerPage;
    const paginatedData = data.slice(startPosition, endPosition);
    setPaginatedData(paginatedData);
  }, [page, rowsPerPage, data]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    console.log(event.target.value);
    setPage(0);
  };

  const CustomPaginationActionComponent = ({ count }) => {
    const handleBackButtonClick = (event) => {
      handleChangePage(event, page - 1);
    };

    const handleNextButtonClick = (event) => {
      handleChangePage(event, page + 1);
    };

    return (
      <div className={paginationRoot}>
        <IconButton
          disabled={page === 0}
          onClick={handleBackButtonClick}
          className={paginationIconButton}
        >
          <ArrowLeft />
        </IconButton>
        <IconButton
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          onClick={handleNextButtonClick}
          className={paginationIconButton}
        >
          <ArrowRight />
        </IconButton>
      </div>
    );
  };

  const renderHeader = () => {
    if (renderRowHeader) {
      return renderRowHeader(data);
    } else {
      return (
        <TableRow>
          {Object.keys(data[0]).map((columnName) => {
            if (columnName !== "id") {
              return (
                <TableCell key={columnName}>
                  {toSentenceCase(columnName)}
                </TableCell>
              );
            }
          })}
        </TableRow>
      );
    }
  };

  const renderRow = () => {
    return paginatedData.map((dataObject, index) => {
      if (renderRowData) {
        return renderRowData(dataObject, page * rowsPerPage + index);
      } else {
        return (
          <TableRow key={dataObject}>
            {Object.keys(dataObject).map(
              (columnName) =>
                columnName !== "id" && (
                  <TableCell>{dataObject[columnName]}</TableCell>
                )
            )}
          </TableRow>
        );
      }
    });
  };

  return (
    <React.Fragment>
      {data.length !== 0 ? (
        <>
          <div className={SelectorComponent ? flexRoot : flexRootEnd}>
            {SelectorComponent && SelectorComponent}
            <TablePagination
              style={{ alignSelf: "flex-end" }}
              rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
              component="div"
              count={data.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onChangePage={handleChangePage}
              onChangeRowsPerPage={handleChangeRowsPerPage}
              ActionsComponent={CustomPaginationActionComponent}
            />
          </div>
          <Paper className={tableContainer} component={Paper}>
            <MaterialTable>
              <TableHead className={tableHead}>{renderHeader()}</TableHead>
              <TableBody>{renderRow()}</TableBody>
            </MaterialTable>
          </Paper>
        </>
      ) : (
        <Grid container justify="center">
          <Grid item>
            <Typography>No Available Data</Typography>
          </Grid>
        </Grid>
      )}
    </React.Fragment>
  );
};

export default Table;
