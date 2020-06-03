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
} from "@material-ui/core";
import { toSentenceCase } from "js-convert-case";

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
}));

const Table = ({ data, renderRowHeader, renderRowData }) => {
  const [paginatedData, setPaginatedData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { tableContainer, tableHead } = useStyles();

  //Paginate the data
  useEffect(() => {
    console.log(page);
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
    setPage(0);
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
    return paginatedData.map((dataObject) => {
      if (renderRowData) {
        return renderRowData(dataObject);
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
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
            component="div"
            count={data.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
          <Paper className={tableContainer} component={Paper}>
            <MaterialTable>
              <TableHead className={tableHead}>{renderHeader()}</TableHead>
              <TableBody>{renderRow()}</TableBody>
            </MaterialTable>
          </Paper>
        </>
      ) : null}
    </React.Fragment>
  );
};

export default Table;
