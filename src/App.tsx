// import React, {useState, useEffect} from 'react';
import './App.css';
import React from 'react';

import Routes from './components/Routes';
import Navbar from './components/Navbar';

const App = () => {
  return (
    <div className="App">
      <Navbar />
      <Routes />
    </div>
  );
};

export default App;

// function App() {
//   const [users, setUsers] = useState({users: []});

//   useEffect(() => {
//     const fetchData = async () => {
//       const {data} = await axios.get("/api/users");
//       setUsers(data);
//     }

//     fetchData();
//   }, []); //not sure why, but not supplying second argument to useEffect as []
//   //caused the app to constantly make the axios request
//   //also passing in [users] caused the infinite useEffect calls - reference the hooks docs for conditionally firing an effect

//   console.log("one render")
//   return (
//     <div className="App">
//       <h1>Bill Tracker</h1>
//       <Toggle />
//       {
//         users.length ?
//         users.map(user => {
//           return (<UserProfile key={user.id} user={user} />)
//         })
//         :
//         null
//       }
//     </div>
//   );
// }
