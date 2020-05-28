import React from 'react';
import { makeStyles } from '@material-ui/core';
import { Entity } from 'draft-js';

const useStyles = makeStyles({
  link: {
    '&:hover': {
      cursor: 'pointer'
    }
  }
});

const LinkEntity = (props) => {
  const { link } = useStyles();
  const { href } = Entity.get(props.entityKey).getData();
  return (
    <a href={href} className={link} onClick={() => window.open(href)}>
      {props.children}
    </a>
  );
};

export default LinkEntity;
