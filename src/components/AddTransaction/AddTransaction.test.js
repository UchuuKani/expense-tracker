import React from "react";
import ReactDOM from "react-dom";
import AddTransaction from "./AddTransaction";

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<AddTransaction />, div);
});
