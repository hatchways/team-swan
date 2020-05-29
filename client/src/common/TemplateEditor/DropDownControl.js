import React, { useState, useEffect } from 'react';
import {
  makeStyles,
  MenuItem,
  Popper,
  MenuList,
  Paper,
  ClickAwayListener
} from '@material-ui/core';
import { ArrowDropDown } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: '#ffffff',
    fontSize: '0.8rem',
    width: '8rem',
    '&:hover': {
      cursor: 'pointer'
    }
  },
  popper: {
    zIndex: theme.zIndex.snackbar
  }
}));

const DropDownControl = ({ value, menuItems }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { root, popper } = useStyles();

  const openMenu = (event) => {
    event.preventDefault();
    setIsMenuOpen(true);
    setAnchorEl(event.currentTarget);
  };

  return (
    <>
      <Paper
        style={{ display: 'flex', padding: '10px' }}
        classes={{ root }}
        variant="outlined"
        onMouseDown={openMenu}
      >
        <span style={{ flexGrow: 1 }}>{value}</span>
        <ArrowDropDown />
      </Paper>

      <Popper
        className={popper}
        open={isMenuOpen}
        anchorEl={anchorEl}
        role={undefined}
      >
        <ClickAwayListener
          mouseEvent="onMouseDown"
          onClickAway={(e) => {
            if (e.currentTarget !== anchorEl) {
              setIsMenuOpen(false);
            }
          }}
        >
          <Paper>
            <MenuList id="menu-list-grow">
              {menuItems.map(({ label, onMouseDownHandler }) => (
                <MenuItem
                  key={label}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    onMouseDownHandler();
                    setIsMenuOpen(false);
                  }}
                >
                  {label}
                </MenuItem>
              ))}
            </MenuList>
          </Paper>
        </ClickAwayListener>
      </Popper>
    </>
  );
};

export default DropDownControl;
