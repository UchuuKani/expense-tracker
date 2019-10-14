import React, {useState, useEffect} from 'react';
import './App.css';

import Toggle from "./Toggle";
import axios from "axios";
import UserProfile from "./UserProfile";

function App() {
  const [users, setUsers] = useState({users: []});

  useEffect(() => {
    const fetchData = async () => {
      const {data} = await axios.get("/api/users");
      setUsers(data);
    }

    fetchData();
  }, []); //not sure why, but not supplying second argument to useEffect as []
  //caused the app to constantly make the axios request
  //also passing in [users] caused the infinite useEffect calls - reference the hooks docs for conditionally firing an effect


  console.log("one render")
  return (
    <div className="App">
      <Toggle />
      {
        users.length ?
        users.map(user => {
          return (<UserProfile key={user.id} user={user} />)
        })
        :
        null
      }
    </div>
  );
}

export default App;
