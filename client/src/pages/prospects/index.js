import React from "react";
import withAuth from "common/withAuth";
import Drawer from "common/Drawer";
import CustomizedTable from "pages/prospects/component/Table";
import axios from "axios";
import { Container, Grid, Typography, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import SearchSection from "pages/prospects/component/SearchSection";

const useStyles = makeStyles((theme) => ({
  rootContainer: {
    margin: "1rem",
  },
  gridElement: {
    padding: "0.75rem;",
  },
}));

// Create context object
export const SearchContext = React.createContext();

// Set up Initial State
const initialState = {
  inputText: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "UPDATE_INPUT":
      return {
        inputText: action.data,
      };

    default:
      return initialState;
  }
}

//TODO propects page
const Prospects = (props) => {
  const classes = useStyles();
  const id = props.user.id;
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const prevId = React.useRef();

  const [prospectData, setProspectData] = React.useState([]);

  React.useEffect(() => {
    const getProspects = async () => {
      if (id) {
        const prospects = await axios.get(`/api/user/${id}/prospects`);
        setProspectData(prospects.data);
      }
    };
    if (prevId.current !== id) {
      getProspects();
    }
  }, [id]);

  React.useEffect(() => {
    prevId.current = id;
  }, [id]);

  const left = <SearchSection></SearchSection>;

  const right = (
    <div>
      <Container className={classes.rootContainer}>
        <div>
          <Grid container spacing={3}>
            <Grid item xs={9} className={classes.gridElement}>
              <Typography variant="h4">Prospects</Typography>
            </Grid>
            <Grid className={classes.gridElement} justify={"flex-end"}>
              <Button
                variant="contained"
                size="large"
                color="primary"
                onClick={() => props.history.push("/prospects/import")}
              >
                Import Prospects
              </Button>
            </Grid>
          </Grid>
        </div>
      </Container>
      <CustomizedTable prospectData={prospectData}></CustomizedTable>
    </div>
  );

  return (
    <SearchContext.Provider value={{ state, dispatch }}>
      <div>
        <Drawer
          LeftDrawerComponent={left}
          RightDrawerComponent={right}
        ></Drawer>
      </div>
    </SearchContext.Provider>
  );
};

export default withAuth(Prospects);
