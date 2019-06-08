import React from "react";
import styles from './Transaction.module.css';
import moment from 'moment';
import PropTypes from 'prop-types';

class Transaction extends React.Component {

    render() {
        return <>
            <div className={styles.transaction}>
                <img className={styles.thumbnail}
                     src={'/media/users/' + this.props.transaction.user.uuid + '/thumbnail.jpg'}
                />
                <div className={styles.information}>
                    <div className={styles.top}>
                        <span>
                            {
                                this.props.transaction.sent ?
                                    <><b>You</b> sent {this.props.transaction.user.name} <b></b></> :
                                    <><b>{this.props.transaction.user.name}</b> sent <b>you</b></>
                            }
                        </span>
                        <span className={this.props.transaction.sent ? styles.negative : styles.positive}>
                            {
                                this.props.transaction.coin.symbol + ' ' + (this.props.transaction.amount / 100.0)
                            }
                        </span>
                    </div>
                    <span className={styles.datetime}>
                        {
                            this.formatTime(this.props.transaction.timestamp)
                        }
                    </span>
                </div>
            </div>
            <hr className={styles.separator}/>
        </>
    }

    formatTime(time) {
        const date = new Date(time);
        const now = new Date();
        const monthPrior = new Date();
        monthPrior.setMonth(now.getMonth() - 1);

        // Display the relative date if the transaction happened less than a month ago.
        if(date < monthPrior) {
            return moment(date).format()
        }
        else{
            return moment(date).fromNow();
        }
    }
}

Transaction.propTypes = {
    /**
     * Transaction to display
     */
    transaction: PropTypes.shape({
        /**
         * Amount that was transferred
         */
        amount: PropTypes.number.isRequired,
        /**
         * Timestamp of when the transaction occurred
         */
        timestamp: PropTypes.string.isRequired,
        /**
         * Message sent with the transaction
         */
        message: PropTypes.string.isRequired,
        /**
         * If the transaction saw sent or received by the user
         */
        sent: PropTypes.bool.isRequired,
        /**
         * User who sent/received the transaction
         */
        user: PropTypes.shape({
            /**
             * User's email
             */
            email: PropTypes.string.isRequired,
            /**
             * User's name
             */
            name: PropTypes.string.isRequired,
            /**
             * User's UUID
             */
            uuid: PropTypes.string.isRequired
        }).isRequired,
        /**
         * Coin that was transferred in the transaction
         */
        coin: PropTypes.shape({
            /**
             * Coin's name
             */
            name: PropTypes.string.isRequired,
            /**
             * Coin's symbol
             */
            symbol: PropTypes.string.isRequired,
            /**
             * Coin's UUID
             */
            uuid: PropTypes.string.isRequired
        }).isRequired
    }).isRequired
};

export default Transaction;
