import React from "react";
import {
  makeStyles,
  InputAdornment,
  Container,
  FormControl,
  OutlinedInput,
  InputLabel,
} from "@material-ui/core";
import { SearchOutlined as SearchOutlinedIcon } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  filterSearch: {
    marginTop: theme.spacing(2),
  },
}));

const SideBarContent = ({ searchCampaignName, setSearchCampaignName }) => {
  const { filterSearch } = useStyles();

  return (
    <Container>
      <FormControl fullWidth className={filterSearch} variant="outlined">
        <InputLabel htmlFor="outlined-adornment-email">Search</InputLabel>
        <OutlinedInput
          autoComplete={"off"}
          id="outlined-adornment-amount"
          value={searchCampaignName}
          onChange={(e) => setSearchCampaignName(e.target.value)}
          startAdornment={
            <InputAdornment position="start">
              <SearchOutlinedIcon></SearchOutlinedIcon>
            </InputAdornment>
          }
          labelWidth={60}
        />
      </FormControl>
    </Container>
  );
};

export default SideBarContent;
