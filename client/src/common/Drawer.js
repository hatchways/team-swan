import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import MailIcon from "@material-ui/icons/Mail";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerContainer: {
    overflow: "hidden",
    marginTop: "3.5rem",
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

export default function ClippedDrawer({
  LeftDrawerComponent,
  RightDrawerComponent,
}) {
  const classes = useStyles();

  const ref = React.useRef(null);

  React.useEffect(() => {
    ref.current.focus();
  }, []);

  return (
    <div className={classes.root}>
      <CssBaseline />

      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <Toolbar />
        <div className={classes.drawerContainer} ref={ref}>
          {LeftDrawerComponent}
        </div>
      </Drawer>
      <main className={classes.content}>
        {/* <Toolbar /> */}
        {RightDrawerComponent}
      </main>
    </div>
  );
}
