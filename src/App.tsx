// import React, {useState, useEffect} from 'react';
import "./App.scss";
import React from "react";

import Routes from "./components/Routes";
import Header from "./components/Header";
import Footer from "./components/Footer";

const App = () => {
  return (
    <div className="App">
      <Header />
      <Routes />
      <Footer />
    </div>
  );
};

export default App;
