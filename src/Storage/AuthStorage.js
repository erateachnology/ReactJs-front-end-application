import { React, useState } from "react";
import { createContext } from "react";

const AuthContext = createContext({
  token: "",
  isLoggedIn: false,
  companyId: "",
  login: (token) => {},
  logout: () => {},
});

export const AuthContextProvider = (props) => {
  const [token, setToken] = useState("");
  const userIsLoggedIn = !!token;

  const handleLogIn = (token) => {
    setToken(token);
  };

  const handlelogOut = () => {
    setToken(null);
  };

  const contextValue = {
    token: token,
    isLoggedIn: userIsLoggedIn,
    login: handleLogIn,
    logout: handlelogOut,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};
export default AuthContext;
