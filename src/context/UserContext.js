import React, { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useNavigate, useLocation } from "react-router-dom";

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

const saveUserToLocalStorage = (user) => {
  localStorage.setItem("user", JSON.stringify(user));
};

const getUserFromLocalStorage = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

export const UserProvider = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(getUserFromLocalStorage());

  useEffect(() => {
    if (user) {
      saveUserToLocalStorage(user);
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  useEffect(() => {
    // 如果 URL 中包含 user 参数，则将其解析并设置为当前用户
    const params = new URLSearchParams(location.search);
    const userParam = params.get("user");
    if (userParam) {
      const userFromParams = JSON.parse(userParam);
      setUser(userFromParams);
      saveUserToLocalStorage(userFromParams);
      params.delete("user");
      navigate(`${location.pathname}?${params.toString()}`, { replace: true });
    }
  }, [location, navigate]);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  return <UserContext.Provider value={{ user, login, logout }}>{children}</UserContext.Provider>;
};

UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
