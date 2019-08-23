import React from "react";
import styles from './Login.module.scss'
import axios from 'axios';
import {Link, Redirect} from "react-router-dom";
import MessageModal from "../modal/message/MessageModal";
import LoadingModal from "../modal/loading/LoadingModal";
import {authenticate} from "../../actions/authenticationActions";
import {connect} from "react-redux";
import PropTypes from "prop-types";

class Login extends React.Component {

    constructor(props) {
        super(props);

        this.form = React.createRef();
    }

    state = {
        email: '',
        password: '',
        responseError: undefined,
        loading: false
    };

    render() {
        // Go back to base page if the user is already logged in
        if (this.props.authenticated) {
            return <Redirect to='/' push/>
        }
        return <form ref={this.form} className={styles.container}>
            <LoadingModal visible={this.state.loading} title='Logging In'/>
            <MessageModal visible={this.state.responseError || false} title='Error' message={this.state.responseError}
                          onConfirm={
                              () => this.setState({responseError: undefined})
                          }
            />
            <div className={styles.loginElements}>
                <input type="email" required placeholder="Email" value={this.state.email}
                       onChange={
                           event => this.setState({email: event.target.value})
                       }
                />
                <input type="password" required minLength='8' placeholder="Password" value={this.state.password}
                       onChange={
                           event => this.setState({password: event.target.value})
                       }
                />
                <div className={styles.actions}>
                    <button
                        onClick={event => {
                            // Prevent the button submitting the form
                            event.preventDefault();

                            // Check the email and password fields meet the requirements and attempt to log in if they do
                            if (this.form.current.checkValidity()) {
                                this.login();
                            } else {
                                this.form.current.reportValidity();
                            }
                        }}
                    >
                        Log In
                    </button>
                    <Link to='/register'>
                        <button>
                            Register
                        </button>
                    </Link>
                </div>
            </div>
        </form>
    }

    /**
     * Attempt to log in with the given email and password
     */
    async login() {
        try {
            // Enable the loading modal
            this.setState({loading: true});

            // Send the login request to the api server and wait for the response
            await axios.post('/api/users/login', {
                email: this.state.email,
                password: this.state.password
            });

            // Updates the authenticated state in the application and redirect the user out of this page
            this.props.authenticate();
        } catch (err) {
            // The server returned an error code

            // Disable the loading modal
            this.setState({loading: false});

            // Enable the error message modal
            const response = err.response;
            const code = response.status;
            if (code === 400) {
                this.setState({responseError: 'Incorrect email or password. Please try again.'});
            } else {
                this.setState({responseError: 'An error has occurred while logging in. Please try again.'});
            }
        }
    }
}

Login.propTypes = {
    /**
     * If the user is currently authenticated.
     * Passed by redux.
     */
    authenticated: PropTypes.bool
};

const mapStateToProps = state => ({
    authenticated: state.authenticated
});

const mapActionsToProps = {
    authenticate: authenticate
};

export default connect(mapStateToProps, mapActionsToProps)(Login);
