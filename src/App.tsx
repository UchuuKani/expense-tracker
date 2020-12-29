// import React, {useState, useEffect} from 'react';
import "./App.scss";
import React from "react";

import Routes from "./components/Routes";
import Header from "./components/Header";
import Footer from "./components/Footer/Footer";
import { UserContextProvider } from "./components/UserContext/UserContext";

const App = () => {
  return (
    <UserContextProvider>
      <div className="App">
        <Header />
        <Routes />
        <Footer />
      </div>
    </UserContextProvider>
  );
};

export default App;
