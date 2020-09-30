import React from "react";

const LandingPage: React.FunctionComponent = () => {
  return (
    <div className="landing-page">
      <h1>Expense Logger</h1>
      <h2>This is an app to manually log your transactions</h2>
      <article>{new Array(100).fill("Lorem ipsum").join("")}</article>
      <h2>Sign up and sign in will be available later</h2>
      <ul>
        {new Array(25).fill(1).map((space, idx) => {
          return <li key={idx}>Take up space</li>;
        })}
      </ul>
    </div>
  );
};

export default LandingPage;
