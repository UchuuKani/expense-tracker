import React from "react";
import { Route, Switch, RouteComponentProps } from "react-router-dom";

import Test from "./Test";
import LandingPage from "./LandingPage";
import UserList from "./UserList";
import UserProfile from "./UserProfile";

type TParams = {
  userId: string;
  transactionId?: string;
};

const Routes = ({ match }: RouteComponentProps<TParams>) => {
  return (
    <Switch>
      {" "}
      {/* should determine how to better utilize Switch */}
      <Route exact path="/" component={LandingPage} />
      <Route exact path="/users" component={UserList} />
      <Route
        path="/users/:userId/transactions/:transactionId"
        component={Test}
      />
      <Route
        path="/users/:userId"
        render={({ match }) => <UserProfile userId={match.params.userId} />}
      />{" "}
      {/* this pattern for passing down route props more performant I believe? - supposed to prevent re-renders or something, a reference is below
      https://learnwithparam.com/blog/how-to-pass-props-in-react-router/
      https://www.robinwieruch.de/react-pass-props-to-component#pass-props-with-react-router
    */}
      <Route path="/tags" component={Test} />
    </Switch>
  );
};

export default Routes;
