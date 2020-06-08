import React from "react";
import {
  makeStyles,
  InputAdornment,
  FormControl,
  TextField,
} from "@material-ui/core";
import { SearchOutlined as SearchOutlinedIcon } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  searchBoxMargin: {
    marginTop: theme.spacing(1),
  },
}));

const SearchBar = ({ searchText, setSearchText }) => {
  const { searchBoxMargin } = useStyles();

  return (
    <FormControl fullWidth className={searchBoxMargin} variant="outlined">
      <TextField
        autoFocus
        label="Search"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        variant="outlined"
        id="mui-theme-provider-outlined-input"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchOutlinedIcon color={"primary"} />
            </InputAdornment>
          ),
        }}
      />
    </FormControl>
  );
};

export default SearchBar;
