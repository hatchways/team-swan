import React, { useState, useEffect, createContext } from "react";
import ErrorSnackBar from "./ErrorSnackbar";
import SuccessSnackBar from "./SuccessSnackbar";

export const SnackbarContext = createContext();

const SnackbarProvider = ({ children }) => {
  //Snackbar Error State
  const [isErrorSnackbarOpen, setIsErrorSnackbarOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  //Snackbar Success State
  const [isSuccessSnackbarOpen, setIsSuccessSnackbarOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  //Close success snackbar if error snack bar opens
  useEffect(() => {
    if (isErrorSnackbarOpen) {
      setIsSuccessSnackbarOpen(false);
    }
  }, [isErrorSnackbarOpen]);

  //Close error snackbar if success snack bar opens
  useEffect(() => {
    if (isSuccessSnackbarOpen) {
      setIsErrorSnackbarOpen(false);
    }
  }, [isSuccessSnackbarOpen]);

  return (
    <SnackbarContext.Provider
      value={{
        setErrorMessage,
        setIsErrorSnackbarOpen,
        setSuccessMessage,
        setIsSuccessSnackbarOpen
      }}
    >
      <ErrorSnackBar
        message={errorMessage}
        open={isErrorSnackbarOpen}
        onClose={() => {
          setIsErrorSnackbarOpen(false);
        }}
      />
      <SuccessSnackBar
        message={successMessage}
        open={isSuccessSnackbarOpen}
        onClose={() => {
          setIsSuccessSnackbarOpen(false);
        }}
      />
      {children}
    </SnackbarContext.Provider>
  );
};

export default SnackbarProvider;
