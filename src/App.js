import React from 'react';
import './App.css';
import {BrowserRouter as Router, Route, Switch, Redirect} from "react-router-dom";
import Login from "./components/login/Login";
import PrivateRoute from "./components/privateRoute/PrivateRoute";
import Cookies from 'universal-cookie';
import Register from "./components/register/Register";
import Home from "./components/home/Home";

const cookies = new Cookies();

class App extends React.Component {
    constructor(props) {
        super(props);

        this.authenticate = this.authenticate.bind(this);
    }

    state = {
        authenticated: cookies.get('authenticated')
    };

    render() {
        return (
            <Router>
                <Switch>
                    <Route exact path="/login" render={() => <Login authenticate={this.authenticate} />}/>
                    <Route exact path='/register' component={Register}/>
                    <PrivateRoute exact path="/" component={Home} authenticated={this.state.authenticated} redirect={'/login'}/>
                    <Route path='/'>
                        <Redirect to='/'/>
                    </Route>
                </Switch>
            </Router>
        );
    }

    authenticate() {
        this.setState({
            authenticated: cookies.get('authenticated')
        });
    }
}

export default App;
