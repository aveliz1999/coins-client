import React from "react";
import SwitchButton from "../switchButton/SwitchButton";
import Select from "react-select";
import UserOption from "./option/UserOption";
import axios from 'axios';
import styles from './TransactionCreator.module.css';
import CoinOption from "./option/CoinOption";
import MessageModal from "../modal/message/MessageModal";
import PropTypes from 'prop-types';
import {connect} from "react-redux";

class TransactionCreator extends React.Component {

    constructor(props) {
        super(props);

        this.submit = this.submit.bind(this);
    }


    state = {
        chargeValue: true,
        autocompleteUsers: [],
        selectedUser: undefined,
        amount: '',
        selectedCoin: undefined,
        message: '',
        error: undefined
    };

    render() {
        return <div className={styles.container}>
            <MessageModal visible={this.state.error}
                          title='Error'
                          message={this.state.error}
                          onConfirm={() => this.setState({error: undefined})}
            />
            <div className={[styles.row, styles.top].join(' ')}>
                <SwitchButton toggleable={true} width={75} value={this.state.chargeValue} text='Charge'
                              secondaryText='Pay'
                              toggle={() => {
                                  this.setState((previousState) => {
                                      return {chargeValue: !previousState.chargeValue}
                                  })
                              }}
                />
                <input readOnly className={styles.inputPrefix} style={{width: 64}} value='Receiver:'/>
                <Select isClearable={true}
                        components={{Option: UserOption}}
                        onInputChange={(value) => {
                            if (value !== '') {
                                this.updateAutocomplete(value);
                            }
                        }}
                        options={this.state.autocompleteUsers}
                        styles={{
                            control: (provided) => {
                                return {
                                    ...provided,
                                    boxShadow: '0 0 0 0 transparent',
                                    border: '1px solid #9e9e9e !important',
                                    borderLeft: '0 !important',
                                    borderRadius: 0
                                }
                            }
                        }}
                        onChange={selected => this.setState({'selectedUser': selected})}
                />
            </div>
            {this.state.selectedUser ?
                <>
                    <div className={styles.row}>
                        <input readOnly className={styles.inputPrefix} value='Amount:'/>
                        <input className={styles.amount}
                               value={this.state.amount}
                               onChange={event => this.updateAmount(event.target.value)}
                        />
                        <Select isClearable={true}
                                components={{Option: CoinOption}}
                                options={this.props.coins.map(coin => ({...coin, label: coin.name}))}
                                styles={{
                                    control: (provided) => {
                                        return {
                                            ...provided,
                                            width: 250
                                        }
                                    }
                                }}
                                onChange={selected => this.setState({'selectedCoin': selected})}
                        />
                    </div>
                    <div className={styles.row}>
                        <textarea className={styles.message}
                                  placeholder='Message'
                                  value={this.state.message}
                                  onChange={event => this.setState({'message': event.target.value})}
                        />
                    </div>
                    <div className={[styles.row, styles.bottom].join(' ')}>
                        <button className={styles.submit}
                                onClick={this.submit}
                        >
                            Send
                        </button>
                    </div>
                </> : null
            }
        </div>
    }

    /**
     * Update the autocomplete entries to display
     * @param name The name the user is searching for currently
     */
    async updateAutocomplete(name) {
        try {
            const result = (await axios.get('/api/users/search/' + name)).data;
            const labeled = result.map(user => {
                return {...user, label: user.name, value: user.email}
            });
            this.setState({autocompleteUsers: labeled});
        } catch (e) {
            this.error = 'An error occurred while retrieving user data'
        }
    }

    /**
     * Check the amount the user wants to make sure it's a valid number and then update it if it is
     * @param value The value to be checked and set
     */
    updateAmount(value) {
        if (/^-?[0-9]*\.?[0-9]{0,2}$/.test(value)) {
            if (value !== '') {
                let number = parseFloat(value) * 100;
                if (number > Number.MAX_SAFE_INTEGER || number < Number.MIN_SAFE_INTEGER) {
                    return;
                }
            }
            this.setState({amount: value})
        }
    }

    /**
     * Check that the transaction parameters are valid and submit the transaction
     */
    submit() {
        if (!this.state.selectedCoin) {
            this.setState({error: 'Please select a coin'});
        } else if (!this.state.amount) {
            this.setState({error: 'Please specify an amount.'});
        } else if (!this.state.chargeValue && (parseFloat(this.state.amount) * 100) > this.state.selectedCoin.amount) {
            this.setState({error: 'You don\'t have enough to send that amount of coins.'});
        } else if (this.state.message.length > 64) {
            this.setState({error: 'Messages can only contain up to 64 characters.'})
        } else {
            this.props.submit({
                chargeValue: this.state.chargeValue,
                receiver: this.state.selectedUser,
                amount: Math.round(parseFloat(this.state.amount) * 100),
                coin: this.state.selectedCoin,
                message: this.state.message
            });
        }
    }
}

TransactionCreator.propTypes = {
    /**
     * List of coins that the user creating the transaction owns.
     * Passed by redux.
     */
    coins: PropTypes.arrayOf(PropTypes.shape({
        /**
         * Amount of the coin the user owns
         */
        amount: PropTypes.number.isRequired,
        /**
         * Name of the coin
         */
        name: PropTypes.string.isRequired,
        /**
         * Symbol of the coin
         */
        symbol: PropTypes.string.isRequired,
        /**
         * UUID of the coin
         */
        uuid: PropTypes.string.isRequired
    })).isRequired,
    /**
     * Submit function that is called when the send button is clicked with acceptable inputs
     */
    submit: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    coins: state.ownedCoins
});

export default connect(mapStateToProps)(TransactionCreator);
