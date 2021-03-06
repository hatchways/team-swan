import React, { useState, createContext } from "react";
import axios from "axios";
import socketIOClient from "socket.io-client";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const [socket, setSocket] = useState(null);

  const logout = () => {
    axios.post("/api/signout").then((response) => {
      setUser(null);
    });
  };

  const validateAuthCookie = () => {
    axios
      .get("/api/currentuser")
      .then((response) => {
        let userData = response.data.currentUser;
        if (
          !user ||
          user.firstName !== userData.firstName ||
          user.lastName !== userData.lastName ||
          user.image !== userData.image ||
          user.hasGmailAuthorized !== userData.hasGmailAuthorized
        ) {
          setUser(userData);
          const socketInfo = socketIOClient("/");
          setSocket(socketInfo);
        }
      })
      .catch((error) => {
        if (error.response.status === 401) {
          logout();
        }
      });
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, validateAuthCookie, logout, socket }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export default AuthProvider;
