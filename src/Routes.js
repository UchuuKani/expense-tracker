import React from "react";
import {Route, Switch} from "react-router-dom";

import Test from "./Test";
import LandingPage from "./LandingPage";

const Routes = (props) => {
  return (
    <Switch> {/* should determine how to better utilize Switch */}
      <Route exact path="/" component={LandingPage} />
      <Route exact path="/users" component={Test} />
      <Route path="/users/:userId/transactions" component={Test} />
      <Route path="/users/:userId" component={Test} />
      <Route path="/tags" component={Test} />
    </Switch>
  )
}

export default Routes;
