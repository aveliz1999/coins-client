import React from "react";
import './Register.scss';
import {Link} from "react-router-dom";
import axios from "axios";
import LoadingModal from "../modal/loading/LoadingModal";
import MessageModal from "../modal/message/MessageModal";

class Register extends React.Component {

    constructor(props) {
        super(props);

        this.form = React.createRef();
    }

    state = {
        email: '',
        name: '',
        password: '',
        confirmPassword: '',
        responseError: undefined,
        loading: false,
        registered: false
    };

    render() {
        return <form ref={this.form} className="container">
            <LoadingModal visible={this.state.loading} title='Registering'/>
            <MessageModal visible={this.state.registered} title='Registered'
                          message='Your account was successfully created. You can now go back and log in.'
                          onConfirm={
                              () => this.setState({registered: false})
                          }
            />
            <MessageModal visible={this.state.responseError} title='Error' message={this.state.responseError}
                          onClick={
                              () => this.setState({responseError: undefined})
                          }
            />

            <div className='register-elements'>
                <input type="email" required placeholder="Email" value={this.state.email}
                       onChange={
                           event => this.setState({email: event.target.value})
                       }
                />
                <input type='text' required minLength='4' maxLength='45' placeholder='Name'
                       onChange={
                           event => this.setState({name: event.target.value})
                       }
                />
                <input type="password" required minLength='8'
                       pattern={'^[ !"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~a-zA-Z0-9]*$'} placeholder="Password"
                       value={this.state.password}
                       onChange={
                           event => {
                               const target = event.target;
                               target.setCustomValidity('');
                               this.setState({password: target.value},() => {
                                   // Set the password field error if it doesn't match the required pattern
                                   if(target.validity.patternMismatch) {
                                       target.setCustomValidity('Passwords can only contain letters, numbers, spaces, and the following symbols: !"#$%&\'()*+,-./:;<=>?@[]^_`{|}~')
                                       target.reportValidity();
                                   }
                               });
                           }
                       }
                />
                <input type='password' required placeholder="Confirm Password"
                       onChange={
                           event => {
                               const target = event.target;
                               target.setCustomValidity('');
                               this.setState({confirmPassword: target.value}, () => {
                                   // Set the confirm password field error if the passwords don't match
                                   if(this.state.password !== this.state.confirmPassword) {
                                       target.setCustomValidity('Passwords must be the same');
                                       target.reportValidity();
                                   }
                               });
                           }
                       }
                />
                <button onClick={event => {
                    // Prevent the button submitting the form
                    event.preventDefault();

                    // Check if the form fields meet the requirements and attempt to register if they do
                    if (this.form.current.checkValidity()) {
                        this.register();
                    }
                    else{
                        this.form.current.reportValidity();
                    }
                }}>
                    Register
                </button>
                <Link to='/login'>
                    <button className='fill-width'>
                        Back
                    </button>
                </Link>
            </div>
        </form>
    }

    async register() {
        try {
            // Enable the loading modal
            this.setState({loading: true});

            // Send the register request to the api server and wait for the response
            await axios.post('/api/users/', {
                email: this.state.email,
                password: this.state.password,
                name: this.state.name
            });

            // Disable the loading modal and enable the success message modal
            this.setState({loading: false, registered: true});
        } catch (err) {
            // The server returned an error code

            // Disable the loading modal
            this.setState({loading: false});

            // Enable the error message modal
            const response = err.response;
            const code = response.status;
            if (code === 400) {
                this.setState({responseError: 'An account with that email already exists.'});
            } else {
                this.setState({responseError: 'An error has occurred while logging in. Please try again.'});
            }
        }
    }
}

export default Register;
