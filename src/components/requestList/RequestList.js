import React from "react";
import styles from './RequestList.module.css'
import PropTypes from 'prop-types';
import {ClipLoader} from "react-spinners";
import Request from "./request/Request";

class RequestList extends React.Component {

    render() {
        return <div className={styles.container}>
            {
                this.props.transactions.length > 0 && this.props.transactions.map(transaction => {
                    return <Request request={transaction} />
                })
            }
            {
                (this.props.moreAvailable && !this.props.loading) &&
                <button className={styles.loadMore}
                        onClick={() => this.props.updateRequests()}
                >Load More</button>
            }
            {
                this.props.loading &&
                <div className={styles.spinner}>
                    <ClipLoader/>
                </div>
            }
        </div>
    }
}

RequestList.propTypes = {
    /**
     * List of requests to display
     */
    requests: PropTypes.arrayOf(PropTypes.shape({
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
    })).isRequired,
    /**
     * Function to call when the user wants to load more requests
     */
    updateRequests: PropTypes.func.isRequired,
    /**
     * There are more requests to be retrieved
     */
    moreAvailable: PropTypes.bool.isRequired,
    /**
     * Requests are currently being retrieved
     */
    loading: PropTypes.bool.isRequired
};

export default RequestList;
