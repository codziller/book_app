import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import "./App.css";
import Login from "./Pages/Authentication/Login";
import Register from "./Pages/Authentication/Register";
import UserService from "./Services/user.service";
import Home from "./Pages/App/Home";
import reportWebVitals from "./reportWebVitals";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isAuth: UserService.getCurrentUser() && UserService.getCurrentUser().id,
    };
  }

  render() {
    const { isAuth } = this.state;
    return isAuth ? <Home /> : <Login />;
  }
}

ReactDOM.render(
  <Router>
    <Switch>
      <Route exact path="/" component={App} />

      <Route exact path="/login" component={Login} />
      <Route exact path="/register" component={Register} />

      <Route exact path="/home" component={Home} />
      <Route path="*">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <h2>404 Not Found</h2>
        </div>
      </Route>
    </Switch>
  </Router>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
