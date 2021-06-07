import React from "react";
import { Switch, Route } from "react-router-dom";
import "./App.css";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import Me from "./components/Me/Me";
import Four0four from "./components/Four0four/Four0four";

function App() {
  return (
    <div className="App">
      <Switch>
        <Route exact path="/" component={() => <Login />} />
        <Route exact path="/register" component={() => <Register />} />
        <Route exact path="/me" component={() => <Me />} />
        <Route path="*" component={() => <Four0four />} />
      </Switch>
    </div>
  );
}

export default App;
