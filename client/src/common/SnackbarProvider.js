import React, { useState, createContext } from "react";
import SnackBar from "./Snackbar";

export const SnackbarContext = createContext();

const SnackbarProvider = ({ children }) => {
  //Snackbar State
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [snackbarType, setSnackbarType] = useState("error");

  return (
    <SnackbarContext.Provider
      value={{
        setMessage,
        setIsSnackbarOpen,
        setSnackbarType
      }}
    >
      <SnackBar
        type={snackbarType}
        message={message}
        open={isSnackbarOpen}
        onClose={() => {
          setIsSnackbarOpen(false);
        }}
      />
      {children}
    </SnackbarContext.Provider>
  );
};

export default SnackbarProvider;
