import React, { useEffect } from 'react';
import { makeStyles, Grid, Typography, Paper } from '@material-ui/core';
import { toSentenceCase } from 'js-convert-case';

const useStyles = makeStyles((theme) => ({
  container: {
    width: '100%',
    margin: '2.5rem 0 2.5rem 0',
    padding: '2.5rem 0 2.5rem 0'
  },
  dataSummaryContainer: {
    borderLeft: `1px ${theme.palette.grey[300]} solid`
  },
  dataNumber: {
    fontWeight: theme.typography.fontWeightLight,
    marginTop: '7px'
  }
}));

const DataSummary = ({ data }) => {
  const { container, dataSummaryContainer, dataNumber } = useStyles();

  return (
    <Grid className={container} item container component={Paper}>
      {data.map(({ label, value }) => (
        <Grid
          key={label}
          className={dataSummaryContainer}
          item
          container
          direction="column"
          alignContent="center"
          xs={true}
        >
          <Typography align="center">{label}</Typography>
          <Typography
            className={dataNumber}
            color="primary"
            align="center"
            variant="h4"
          >
            {value || 0}
          </Typography>
        </Grid>
      ))}
    </Grid>
  );
};

export default DataSummary;
