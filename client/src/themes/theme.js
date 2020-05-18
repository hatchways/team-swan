import { createMuiTheme } from "@material-ui/core";

export const theme = createMuiTheme({
  typography: {
    fontFamily: '"Open Sans"',
    fontSize: 13,
    body1: {
      fontSize: "0.9rem",
      fontWeight: 700
    },
    button: {
      fontSize: "1rem",
      fontWeight: 700,
      fontSize: "0.875rem",
      lineHeight: 1.75,
      textTransform: "none"
    }
  },
  palette: {
    // Main app colors
    primary: { main: "#3eb485" },
    secondary: { main: "#FFFFFF" },
    contrastThreshold: 2,
    background: {
      default: "#f4f6fc" //background body
    }
  },
  shadows: [
    // Set box shadows using the elevation prop on Paper type components. Use the index value. Example: elevation={1}
    "none",
    "0 0 0 1px rgba(0, 0, 0, 0.05)",
    "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
    "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
  ],
  overrides: {
    MuiButton: {
      //Button overrides
      sizeLarge: {
        padding: "1rem"
      },
      outlinedPrimary: {
        color: "#000000"
      }
    },
    MuiAppBar: {
      //App bar overrides
      root: {
        borderBottom: "1px solid #E0E0E0",
        padding: "0.5rem 0 0.5rem 0"
      }
    }
  }
});
