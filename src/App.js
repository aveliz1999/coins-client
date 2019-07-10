import React from 'react';
import './App.css';
import {BrowserRouter as Router, Redirect, Route, Switch} from "react-router-dom";
import Register from "./components/register/Register";
import Home from "./components/home/Home";
import Menu from "./components/menu/Menu";
import MessageModal from "./components/modal/message/MessageModal";
import axios from "axios";
import PrivateRoute from "./components/privateRoute/PrivateRoute";
import Login from "./components/login/Login";
import {updateUser} from "./actions/userActions";
import {connect} from "react-redux";
import {addCoins} from "./actions/ownedCoinsActions";

class App extends React.Component {

    state = {
        responseError: false,
        userUpdated: false
    };

    render() {
        if (this.props.authenticated && !this.state.userUpdated) {
            this.updateUser();
            this.updateCoins();
            this.setState({userUpdated: true});
        }
        return <Router>
            {this.props.authenticated && <Menu links={
                [
                    {
                        link: '/',
                        label: 'Home',
                        icon: 'home'
                    }
                ]
            }/>}
            {

                <MessageModal
                    title={'Error'}
                    message={this.state.responseError}
                    onConfirm={() => {
                    }}
                    visible={this.state.userError}
                />
            }
            <Switch>
                <Route exact path="/login" render={() => <Login/>}/>
                <Route exact path='/register' component={Register}/>
                <PrivateRoute exact path="/" component={Home} authenticated={this.props.authenticated}
                              redirect={'/login'}/>
                <Route path='/'>
                    <Redirect to='/'/>
                </Route>
            </Switch>
        </Router>
    }

    async updateUser() {
        try {
            let user = (await axios.get('/api/users/')).data;
            this.props.updateUser(user);
        } catch (e) {
            this.setState({responseError: 'An error occurred while retrieving your user information.'});
        }
    }

    async updateCoins() {
        try {
            let coins = (await axios.get('/api/coins/')).data;
            this.props.updateCoins(coins)
        } catch (e) {
            this.setState({responseError: 'An error occurred while retrieving your coins list.'});
        }
    }
}

const mapStateToProps = state => ({
    authenticated: state.authenticated
});

const mapActionsToProps = {
    updateUser: updateUser,
    updateCoins: addCoins
};

export default connect(mapStateToProps, mapActionsToProps)(App);
