import React from "react";
import { Container } from "@material-ui/core";
import SearchOutlinedIcon from "@material-ui/icons/SearchOutlined";
import InputLabel from "@material-ui/core/InputLabel";
import InputAdornment from "@material-ui/core/InputAdornment";
import FormControl from "@material-ui/core/FormControl";
import { makeStyles } from "@material-ui/core/styles";
import OutlinedInput from "@material-ui/core/OutlinedInput";
// Import Context
import { SearchContext } from "../index";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
  },
  margin: {
    marginTop: theme.spacing(2),
  },
  withoutLabel: {
    marginTop: theme.spacing(3),
  },
  textField: {
    width: "25ch",
  },
}));

const SearchSection = (props) => {
  const classes = useStyles();

  const [values, setValues] = React.useState({
    email: "",
  });
  const { state, dispatch } = React.useContext(SearchContext);

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
    dispatch({ type: "UPDATE_INPUT", data: event.target.value });
  };

  return (
    <React.Fragment>
      <div>
        <Container>
          <FormControl fullWidth className={classes.margin} variant="outlined">
            <InputLabel htmlFor="outlined-adornment-email">Search</InputLabel>
            <OutlinedInput
              autoFocus={true}
              autoComplete={"off"}
              id="outlined-adornment-amount"
              value={state.inputText}
              onChange={handleChange("email")}
              startAdornment={
                <InputAdornment position="start">
                  <SearchOutlinedIcon></SearchOutlinedIcon>
                </InputAdornment>
              }
              labelWidth={60}
            />
          </FormControl>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default SearchSection;
