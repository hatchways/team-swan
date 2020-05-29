import React, { useState, createContext } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  const logout = () => {
    axios.post('/api/signout').then((response) => {
      setUser({});
      setIsAuthenticated(false);
    });
  };

  const validateAuthCookie = () => {
    axios
      .get('/api/currentuser')
      .then((response) => {
        let userData = response.data.currentUser;
        if (
          !isAuthenticated ||
          user.firstName !== userData.firstName ||
          user.lastName !== userData.lastName ||
          user.image !== userData.image
        ) {
          setUser(userData);
          setIsAuthenticated(true);
        }
      })
      .catch((error) => {
        if (error.response.status === 401) {
          logout();
        }
      });
  };

  // const hasGmailAuthorized = async () => {
  //   try{

  //   }catch(err){

  //   }
  // };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, setUser, validateAuthCookie, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export default AuthProvider;
