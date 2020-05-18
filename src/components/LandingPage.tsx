import React from "react";

const LandingPage: React.FunctionComponent = () => {
  return (
    <div className="landing-page">
      <h1>Expense Logger</h1>
      <h2>This is an app to manually log your transactions</h2>
      <h2>Sign up and sign in will be available later</h2>
      <ul>
        {new Array(15).fill(1).map((space, idx) => {
          return <li key={idx}>Take up space</li>;
        })}
      </ul>
    </div>
  );
};

export default LandingPage;
