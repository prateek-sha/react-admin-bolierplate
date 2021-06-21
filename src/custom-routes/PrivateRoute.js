import React from 'react';
import { useSelector } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const login = useSelector(state => state.appStatus.login)
  return (
    <Route
      {...rest}
      render={props =>
        login ? (
          <Component {...props} {...rest} />
          ) : (
            <Redirect to={'/login'} /> 
            )
          
      }
    />
  );
};

export default PrivateRoute;
