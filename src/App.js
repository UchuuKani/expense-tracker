import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import Test from "./Test";
import Toggle from "./Toggle";
import axios from "axios";

// function App() {
//   return (
//     <div className="App">
//       {<header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header> }
//       <Test />
//       <Toggle />
//     </div>
//   );
// }

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: ''
    };
  }

  async componentDidMount() {
    try {
      const {data} = await axios.get("/api/dogs/1");

      this.setState({
        name: data.name,
        email: data.email
      })
    } catch(err) {
      console.error(err);
    }
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
          {this.state.name ? <p>Name: {this.state.name} Email: {this.state.email}</p> : <p>Nothing here yet</p>}
        </header>
      </div>
    );
  }
}

export default App;
