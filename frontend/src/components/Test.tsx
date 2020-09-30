import React from "react";

const Test = (props: any) => {
  const {
    match: { params },
  } = props;
  return (
    <div>
      <h1>This is a test: {params.userId}</h1>
      <p>This is also part of the test: {}</p>
    </div>
  );
};

export default Test;
