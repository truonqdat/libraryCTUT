import React, { useEffect, useState } from "react";
import userService from "../services/userService";

export const userContext = React.createContext();

export const ContextProvide = ({ children }) => {
  const [loggedInUser, setloggedInUser] = useState({
    userData: "",
    auth: false,
  });
  const loginContext = (name) => {
    setloggedInUser({ userData: name, auth: true });
  };
  
  const logoutContext = () => {
    setloggedInUser({ userData: "", auth: false });
    userService.logOut();
  };

  useEffect(() => {
    userService.getInfoUser().then((response) => {
      if (response.err !== 0) {
        setloggedInUser({ userData: response.data.loggedInUser, auth: true });
      } else {
        setloggedInUser({ userData: response, auth: false });
      }
    });
  }, []);

  return (
    <userContext.Provider value={{ loggedInUser, loginContext, logoutContext }}>
      {children}
    </userContext.Provider>
  );
};
