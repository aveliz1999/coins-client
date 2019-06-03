import React from "react";
import {Route, Redirect} from "react-router-dom";
import PropTypes from 'prop-types';

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

PrivateRoute.propTypes = {
    /**
     * Component to show if the path is matched and the authenticated
     */
    component: PropTypes.elementType.isRequired,
    /**
     * If the user is authenticated to show the path
     */
    authenticated: PropTypes.bool.isRequired,
    /**
     * Whether to match the path exactly or not
     */
    exact: PropTypes.bool,
    /**
     * The path to match in the route
     */
    path: PropTypes.string.isRequired,
    /**
     * The path to redirect to if the route is matched but the user is not authenticated
     */
    redirect: PropTypes.string,
    /**
     * Props to pass to the component if the path is matched and the user is authenticated
     */
    componentProps: PropTypes.objectOf(PropTypes.any)
};

export default PrivateRoute;
