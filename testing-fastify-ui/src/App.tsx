import React from "react";
import "./App.css";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import Me from "./components/Me/Me";

function App() {
  return (
    <div className="App">
      <Register />
      <Login />
      <Me />
    </div>
  );
}

export default App;
