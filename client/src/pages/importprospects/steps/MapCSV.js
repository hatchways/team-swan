import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { NativeSelect } from "@material-ui/core";

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.success.main,
    textAlign: "center;",
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const useStyles = makeStyles({
  table: {
    minWidth: 700,
  },
});

export default function MapCSV({ tableHead, attributes, properties, mappedAttributes, setMappedAttributes }) {
  const classes = useStyles();
  const [propertiesAvailable, setPropertiesAvailable] = React.useState(properties)


  const onChange = (event) => {
    const dbValue = event.target.value
    const attrFromCSV = event.target.name
    setPropertiesAvailable(propertiesAvailable.filter(attr => attr !== dbValue))
    setMappedAttributes({ ...mappedAttributes, [attrFromCSV]: dbValue })
  }

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="customized table">
        <TableHead>
          <TableRow>
            {tableHead.map((element) => {
              return (
                <StyledTableCell key={element}>{element}</StyledTableCell>
              )
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          {attributes.map((attr) => {
            return (
              <TableRow key={Math.random()}>
                <StyledTableCell align="center" component="th" scope="row">
                  {attr}
                </StyledTableCell>
                <StyledTableCell align="center">
                  <NativeSelect name={attr} value={mappedAttributes[attr]} onChange={onChange}>
                    <option value="">None</option>
                    {properties.map((property) => {
                      return (<option value={property} key={property}>{property}</option>)
                    })}
                  </NativeSelect>
                </StyledTableCell>
              </TableRow>)
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
