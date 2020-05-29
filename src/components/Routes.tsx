import React from "react";
import { Route, Switch, withRouter } from "react-router-dom";

import Test from "./Test";
import LandingPage from "./LandingPage";
import UserList from "./UserList";
import UserProfile from "./UserProfile";
import SingleTransaction from "./SingleTransaction";

const Routes = () => {
  return (
    <Switch>
      {" "}
      {/* should determine how to better utilize Switch */}
      <Route exact path="/" component={LandingPage} />
      <Route exact path="/users" component={UserList} />
      <Route
        path="/users/:userId/transactions/:transactionId"
        component={SingleTransaction}
      />
      <Route
        path="/users/:userId"
        // I'll be honest, don't really understand how below line (render=...) works to pass route params from React Router
        // render={({ match }) => <UserProfile userId={match.params.userId} />}
        component={UserProfile}
      />{" "}
      {/* this pattern (render={...stuff}) for passing down route props more performant I believe? - supposed to prevent re-renders or something, a reference is below
      https://learnwithparam.com/blog/how-to-pass-props-in-react-router/
      https://www.robinwieruch.de/react-pass-props-to-component#pass-props-with-react-router
    */}
      <Route path="/tags" component={Test} />
    </Switch>
  );
};

// wrapping my Routes component with `withRouter` per recommendation in this SO answer:
// https://stackoverflow.com/questions/56002251/react-use-routecomponentprops-type-is-missing-the-following-properties-fr
// my understanding is that in the App.tsx file that is using the Routes component, it is expecting props that React Router implicitly
// passes to <Route /> components (history, match, params) to be explicitly passed in
// by using the `withRouter` HOC (higher order component), the three props are passed in and they do not need to be explicitly
// added as props in App.tsx
export default withRouter(Routes);
