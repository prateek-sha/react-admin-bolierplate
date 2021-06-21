import React from "react";
import { AppController } from "./appController/AppController";
import { Provider } from "react-redux";
import { BrowserRouter as Router, Switch, Redirect } from "react-router-dom";
import { store } from "./redux/index";
import { Login } from "./pages/Login";
import PublicRoute from "./custom-routes/PublicRoute";
import PrivateRoute from "./custom-routes/PrivateRoute";

import "antd/dist/antd.css";

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
    </div>
  );
};

export default App;
