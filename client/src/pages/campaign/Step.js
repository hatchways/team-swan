import React, { useEffect } from 'react';
import { makeStyles, Grid, Typography, Paper } from '@material-ui/core';
import { Mail as MailIcon } from '@material-ui/icons';
import { toSentenceCase } from 'js-convert-case';

const useStyles = makeStyles((theme) => ({
  container: {
    width: '100%',
    margin: '2.5rem 0 2.5rem 0',
    padding: '2.5rem 0 2.5rem 0',
    cursor: 'pointer'
  },
  stepInfoContainer: {
    paddingLeft: '3rem'
  },
  owner: {
    color: theme.palette.grey[400]
  },
  dataSummaryContainer: {
    width: '10rem'
  },
  dataLabel: {
    fontSize: '13px'
  },
  dataNumber: {
    fontWeight: theme.typography.fontWeightLight,
    marginTop: '7px'
  }
}));

const DataSummary = ({
  subject,
  userName,
  order,
  data,
  openUpdateStepEditor
}) => {
  const {
    container,
    stepInfoContainer,
    owner,
    dataSummaryContainer,
    dataLabel,
    dataNumber
  } = useStyles();

  return (
    <Grid
      className={container}
      item
      container
      component={Paper}
      onClick={() => openUpdateStepEditor(order)}
    >
      <Grid
        item
        container
        className={stepInfoContainer}
        xs={true}
        alignItems="center"
        spacing={5}
      >
        <Grid item>
          <MailIcon color="primary" />
        </Grid>
        <Grid item>
          <Typography variant="h4">{order}</Typography>
        </Grid>
        <Grid item>
          <Typography variant="h5">{subject}</Typography>
          <Typography className={owner} variant="subtitle2">
            By {userName}
          </Typography>
        </Grid>
      </Grid>
      {data.map(({ label, value }) => (
        <Grid
          className={dataSummaryContainer}
          key={label}
          item
          container
          direction="column"
          alignContent="center"
        >
          <Typography className={dataLabel} align="center">
            {label}
          </Typography>
          <Typography
            className={dataNumber}
            color="primary"
            align="center"
            variant="h5"
          >
            {value || 0}
          </Typography>
        </Grid>
      ))}
    </Grid>
  );
};

export default DataSummary;
