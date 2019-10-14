import React from "react";

class Toggle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {isToggleOn: true, count: 0};

    // This binding is necessary to make `this` work in the callback
    this.handleClick = this.handleClick.bind(this);
  }

  // componentDidUpdate() { //causes infinite loop of setStates
  //   this.setState({count: this.state.count + 1});
  // }

  handleClick() {
    this.setState(prevState => ({
      isToggleOn: !prevState.isToggleOn,
      count: prevState.count + 1
    }));
  }

  render() {
    console.log(this.state.count, this.state.isToggleOn);
    return (
      <button onClick={this.handleClick}>
        {this.state.isToggleOn ? 'ON' : 'OFF'}
      </button>
    );
  }
}

export default Toggle;
