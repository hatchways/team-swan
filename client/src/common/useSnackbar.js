import React, { useContext } from "react";
import { SnackbarContext } from "./SnackbarProvider";

//Hook for using the snackbar
const useSnackbar = () => {
  const {
    setErrorMessage,
    setIsErrorSnackbarOpen,
    setSuccessMessage,
    setIsSuccessSnackbarOpen
  } = useContext(SnackbarContext);

  const showErrorSnackbar = (message) => {
    setErrorMessage(message);
    setIsErrorSnackbarOpen(true);
  };

  const showSuccessSnackbar = (message) => {
    setSuccessMessage(message);
    setIsSuccessSnackbarOpen(true);
  };

  return { showErrorSnackbar, showSuccessSnackbar };
};

export default useSnackbar;
