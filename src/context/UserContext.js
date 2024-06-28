import React, { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useLocation, useNavigate } from "react-router-dom";

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

const saveUserToUrlParams = (user) => {
  const params = new URLSearchParams(window.location.search);
  params.set("user", JSON.stringify(user));
  window.history.replaceState({}, "", `${window.location.pathname}?${params.toString()}`);
};

const getUserFromUrlParams = () => {
  const params = new URLSearchParams(window.location.search);
  const user = params.get("user");
  return user ? JSON.parse(user) : null;
};

export const UserProvider = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(getUserFromUrlParams());

  useEffect(() => {
    if (user) {
      saveUserToUrlParams(user);
    }
  }, [user]);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
    const params = new URLSearchParams(window.location.search);
    params.delete("user");
    navigate(`${window.location.pathname}?${params.toString()}`, { replace: true });
  };

  return <UserContext.Provider value={{ user, login, logout }}>{children}</UserContext.Provider>;
};

UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
