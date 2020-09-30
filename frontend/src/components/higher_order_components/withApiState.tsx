import React from "react";

// the idea behind this HOC is to be able to create a state machine for data fetching in the useAxios custom hook I wrote
// implementation is from here: `link to medium article blog.usejournal`
// I am not totally sure if this constitutes as a FSM?
const withApiState = (TargetComponent: any) => {
  return class extends React.Component {
    // there will be four possible states: idle, pending, success, and error - will start in the idle state
    state = {
      current: "idle",
    };

    // here we define the events that can change our state
    apiState = {
      pending: () => this.setState({ current: "pending" }),
      success: () => this.setState({ current: "success" }),
      error: () => this.setState({ current: "error" }),
      idle: () => this.setState({ current: "idle" }),
      isPending: () => this.state.current === "pending",
      isSuccess: () => this.state.current === "success",
      isError: () => this.state.current === "error",
      isIdle: () => this.state.current === "idle",
    };

    render() {
      return <TargetComponent {...this.props} apiState={this.apiState} />;
    }
  };
};

export default withApiState;
