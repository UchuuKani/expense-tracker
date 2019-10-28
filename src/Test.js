import React from "react";

const Test = (props) => {
  const {match: {params}} = props;
  return (
    <div>
      <h1>This is a test: {params.userId}</h1>
    </div>
  )
}

export default Test;
