import React from "react";
import styles from './TransactionList.module.css'
import axios from 'axios';
import PropTypes from 'prop-types';
import Transaction from "./transaction/Transaction";
import {ClipLoader} from "react-spinners";

class TransactionList extends React.Component {

    constructor(props) {
        super(props);

        this.updateTransactions = this.updateTransactions.bind(this);
    }


    state = {
        transactions: [],
        lastTransactionId: Number.MAX_SAFE_INTEGER,
        loading: false
    };


    componentDidMount() {
        this.updateTransactions();
    }

    render() {
        return <div className={styles.container}>
            {
                this.state.transactions.length ? this.state.transactions.map(transaction => {
                    return <Transaction transaction={transaction} />
                }) : <p className={styles.emptyMessage}>
                    No transactions yet.
                </p>
            }
            {
                (this.state.lastTransactionId !== 0 && !this.state.loading) &&
                <button className={styles.loadMore}
                        onClick={this.updateTransactions}
                >Load More</button>
            }
            {
                this.state.loading &&
                <div className={styles.spinner}>
                    <ClipLoader/>
                </div>
            }
        </div>
    }

    async updateTransactions() {
        try{
            this.setState({loading: true});
            const {transactions, lastId} = (await axios.get('/api/transactions/search/' + this.state.lastTransactionId)).data;
            this.setState((previousState) => ({
                lastTransactionId: transactions.length === 10 ? lastId : 0,
                transactions: [...previousState.transactions, ...transactions]
            }));
        }
        catch(e) {

        }
        this.setState({loading: false});
    }
}

TransactionList.propTypes = {
};

export default TransactionList;
