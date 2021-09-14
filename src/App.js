import React from "react";
import { AppController } from "./appController/AppController";
import {usePromiseTracker} from "react-promise-tracker";
import {ToastContainer} from 'react-toastify';
import { Provider } from "react-redux";
import { BrowserRouter as Router, Switch, Redirect } from "react-router-dom";
import { store } from "./redux/index";
import { Login } from "./pages/login/Login";
import {Spin} from "antd";
import PublicRoute from "./custom-routes/PublicRoute";
import PrivateRoute from "./custom-routes/PrivateRoute";

import 'react-toastify/dist/ReactToastify.css';
import "antd/dist/antd.css";
import './App.css'

const LoadingIndicator = props => {
  const {promiseInProgress} = usePromiseTracker();
  
  return promiseInProgress &&
      <div style={{
          top: 0,
          zIndex: 99999,
          position: "absolute",
          width: "100vw",
          height: "100vh",
          background: "#FFFFFF88"
      }}>
          <span style={{position:'absolute',left:'50%',top:'50%',transform:'translate(-50%,-50%)'}} ><Spin size={'large'}/></span>
      </div>;
}

const App = () => {
  return (
    <div>
      <Provider store={store}>
        <Router>
          <Switch>
            <PublicRoute path="/login" component={Login} />
            <PrivateRoute path="/home" component={AppController} />
            <Redirect from="/" to="/home/" />
          </Switch>
        </Router>
      </Provider>
      <ToastContainer autoClose={3200}/>
      <LoadingIndicator/>
    </div>
  );
};

export default App;
