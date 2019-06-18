import React from "react";
import styles from './TransactionList.module.css'
import PropTypes from 'prop-types';
import Transaction from "./transaction/Transaction";
import {ClipLoader} from "react-spinners";

class TransactionList extends React.Component {

    render() {
        return <div className={styles.container}>
            {
                this.props.transactions.length ? this.props.transactions.map(transaction => {
                    return <Transaction transaction={transaction} />
                }) : (
                    !this.props.loading && <p className={styles.emptyMessage}>
                        No transactions yet.
                    </p>
                )
            }
            {
                (this.props.moreAvailable && !this.props.loading) &&
                <button className={styles.loadMore}
                        onClick={() => this.props.updateTransactions()}
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

TransactionList.propTypes = {
    /**
     * List of transactions to display
     */
    transactions: PropTypes.arrayOf(PropTypes.shape({
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
        }).isRequired
    })).isRequired,
    updateTransactions: PropTypes.func.isRequired,
    moreAvailable: PropTypes.bool.isRequired,
    loading: PropTypes.bool.isRequired
};

export default TransactionList;
