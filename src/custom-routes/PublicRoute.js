import React from 'react';
import { useSelector } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';

const PublicRoute = ({component: Component, ...rest }) => {
  const appStatus = useSelector(state => state.appStatus)
  return (
    <Route
      {...rest}
      render={props =>
        !appStatus.login ? <Component {...props} /> : <Redirect to='/home' />
      }
    />
  );
};

export default PublicRoute;
