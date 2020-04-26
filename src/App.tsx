// import React, {useState, useEffect} from 'react';
import "./App.css";
import React from "react";

import Routes from "./components/Routes";
import Navbar from "./components/Navbar";
import { RouteComponentProps } from "react-router-dom";

const App = () => {
  return (
    <div className="App">
      <Navbar />
      <Routes />
    </div>
  );
};

export default App;
