import React, { useContext } from "react";
import { SnackbarContext } from "./SnackbarProvider";

//Hook for using the snackbar
const useSnackbar = () => {
  const { setMessage, setIsSnackbarOpen, setSnackbarType } = useContext(
    SnackbarContext
  );

  const showSnackbar = (message, type) => {
    setSnackbarType(type);
    setMessage(message);
    setIsSnackbarOpen(true);
  };

  return showSnackbar;
};

export default useSnackbar;
