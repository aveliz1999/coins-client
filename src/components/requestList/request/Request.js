import React from "react";
import styles from './Request.module.css';
import moment from 'moment';
import PropTypes from 'prop-types';

class Request extends React.Component {

    render() {
        return <>
            <div className={styles.request}>
                <img className={styles.thumbnail}
                     src={'/media/users/' + this.props.request.user.uuid + '/thumbnail.jpg'}
                />
                <div className={styles.information}>
                    <div className={styles.top}>
                        <span>
                            <b>{this.props.request.user.name}</b> requested
                        </span>
                        <span className={styles.negative}>
                            {
                                this.props.request.coin.symbol + ' ' + (this.props.request.amount / 100.0)
                            }
                        </span>
                    </div>
                    <span className={styles.datetime}>
                        {
                            this.formatTime(this.props.request.timestamp)
                        }
                    </span>
                    <span>
                        {
                            this.props.request.message + 'Hello there@'
                        }
                    </span>
                    <div className={styles.actions}>
                        <button className={styles.accept}>Accept</button>
                        <button className={styles.decline}>Decline</button>
                    </div>
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

Request.propTypes = {
    /**
     * Transaction to display
     */
    request: PropTypes.shape({
        /**
         * Amount to be transferred
         */
        amount: PropTypes.number.isRequired,
        /**
         * Timestamp of when the request was made
         */
        timestamp: PropTypes.string.isRequired,
        /**
         * Message sent with the request
         */
        message: PropTypes.string.isRequired,
        /**
         * User who sent the request
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
         * Requested coin
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

export default Request;
