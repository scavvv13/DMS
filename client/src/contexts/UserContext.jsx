import { createContext, useState } from "react";
import React from "react";

const userContext = createContext();

export const contextProvider = ({ children }) => {
  const [token, setToken] = useState(null);

  const login = (userToken) => {
    setToken(userToken);
  };

  const logout = (userToken) => {
    setToken(null);
  };
};
