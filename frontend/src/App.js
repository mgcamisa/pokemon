import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";
import { setCurrentUser, logoutUser } from "./actions/authActions";

import { Provider } from "react-redux";
import store from "./store";

import Home from "./components/Home";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import PrivateRoute from "./components/private-route/PrivateRoute";

// Check for token to keep user logged in
if (localStorage.jwtToken) {
  // Set auth token header auth
  const token = localStorage.jwtToken;
  setAuthToken(token);
  // Decode token and get user info and exp
  const decoded = jwt_decode(token);
  // Set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));

// Check for expired token
  const currentTime = Date.now() / 1000; // to get in milliseconds
  if (decoded.exp < currentTime) {
    // Logout user
    store.dispatch(logoutUser());
    // Redirect to login
    window.location.href = "./";
  }
}    

class App extends Component {
  render() {
    return (
	<Provider store={store}>  
	    <Router>
	      <Route path="/" exact component={Home}/>
	      <Route path="/signup" component={Register}/>
	      <Switch>
                <PrivateRoute exact path="/dashboard" component={Dashboard} />
              </Switch>
	    </Router>
	</Provider>
    );
  }
}

export default App;
