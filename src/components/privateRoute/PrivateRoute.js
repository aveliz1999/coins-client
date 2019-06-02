import React from "react";
import {Route, Redirect} from "react-router-dom";

class PrivateRoute extends React.Component {

    render() {
        let Component = this.props.component;

        /**
         * Return the route to the correct component if the authenticated condition is true.
         * If the authenticated condition is false, return a redirect to the given redirect path
          */
        if (this.props.authenticated) {
            return <Route exact={this.props.exact} path={this.props.path}>
                <Component {...this.props.componentProps}/>
            </Route>
        } else {
            return <Route exact path={this.props.path}>
                <Redirect to={this.props.redirect}/>
            </Route>
        }
    }
}

export default PrivateRoute;
