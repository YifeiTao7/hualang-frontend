import React from "react";
import PropTypes from "prop-types";
import { Route, Navigate } from "react-router-dom";
import { useUser } from "context/UserContext";

const PrivateRoute = ({ element, ...rest }) => {
  const { user } = useUser();

  return user ? element : <Navigate to="/authentication/sign-in" />;
};

PrivateRoute.propTypes = {
  element: PropTypes.element.isRequired,
};

export default PrivateRoute;
