import React from "react";
import { Container, makeStyles } from "@material-ui/core";
import SearchBar from "common/SearchBar";
import RadioButtonGroup from "common/RadioButtonGroup";
import { CheckBoxOutlineBlank, CheckBoxRounded } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  marginTop: {
    marginTop: theme.spacing(2),
  },
}));

const SideBarContent = ({
  searchProspectText,
  setSearchProspectText,
  searchField,
  setSearchField,
}) => {
  const classes = useStyles();

  return (
    <Container>
      <SearchBar
        searchText={searchProspectText}
        setSearchText={setSearchProspectText}
      ></SearchBar>
      <RadioButtonGroup
        className={classes.marginTop}
        unCheckedIcon={<CheckBoxOutlineBlank />}
        checkedIcon={<CheckBoxRounded color={"primary"} />}
        value={searchField}
        handleChange={(e) => setSearchField(e.target.value)}
        fields={[
          { email: "Email" },
          { firstName: "First Name" },
          { lastName: "Last Name" },
        ]}
        title={"Search By"}
        showTitle={false}
      />
    </Container>
  );
};

export default SideBarContent;
