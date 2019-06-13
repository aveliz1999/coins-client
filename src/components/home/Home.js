import React from "react";
import styles from './Home.module.scss';
import axios from 'axios';
import TransactionCreator from "../transactionCreator/TransactionCreator";
import TransactionList from "../transactionList/TransactionList";
import MediaQuery from 'react-responsive';
import CoinsList from "../coinsList/CoinsList";
import MessageModal from "../modal/message/MessageModal";
import LoadingModal from "../modal/loading/LoadingModal";
import RequestList from "../requestList/RequestList";
import Tabs from "../tabs/Tabs";

class Home extends React.Component {

    constructor(props) {
        super(props);

        this.updateUser = this.updateUser.bind(this);
        this.updateCoins = this.updateCoins.bind(this);
        this.loadTransactions = this.loadTransactions.bind(this);
        this.loadRequests = this.loadRequests.bind(this);
        this.createTransaction = this.createTransaction.bind(this);
    }

    state = {
        user: undefined,
        coins: [],
        creatingTransaction: false,
        transactions: [],
        lastTransactionId: Number.MAX_SAFE_INTEGER,
        loadingTransactions: false,
        requests: [],
        lastRequestId: Number.MAX_SAFE_INTEGER,
        loadingRequests: false
    };

    componentDidMount() {
        this.updateUser();
        this.updateCoins();
        this.loadTransactions();
        this.loadRequests();
    }

    render() {
        return <div className={styles.container}>
            <div className={styles.transactionsPanel}>
                <TransactionCreator coins={this.state.coins}
                                    submit={this.createTransaction}
                />
                 <div className={styles.transactionsRequestsList}>
                     <Tabs tabs={['Transactions', 'Requests']}>
                         <TransactionList transactions={this.state.transactions}
                                          updateTransactions={this.updateTransactions}
                                          moreAvailable={this.state.lastTransactionId > 0}
                                          loading={this.state.loadingTransactions}
                         />
                         <RequestList transactions={this.state.requests}
                                      updateRequests={this.updateRequests}
                                      moreAvailable={this.state.lastRequestId > 0}
                                      loading={this.state.loadingRequests}
                         />
                     </Tabs>
                 </div>
            </div>
            <MediaQuery query='(min-width: 1024px)'>
                <div className={styles.informationPanel}>
                    { this.state.user &&
                        <>
                            <div className={styles.userInformation}>
                                <img className={styles.userThumbnail} src={'/media/users/' + this.state.user.uuid + '/thumbnail.jpg'}/>
                                <p className={styles.userName}>{this.state.user.name}</p>
                            </div>
                            <hr/>
                        </>
                    }
                    <CoinsList coins={this.state.coins}/>
                </div>
            </MediaQuery>
            <MessageModal title={'Error'}
                          message={this.state.error}
                          onConfirm={() => this.setState({error: undefined})}
                          visible={this.state.error}
            />
            <LoadingModal title={'Creating Transaction'} visible={this.state.creatingTransaction}/>
        </div>
    }

    /**
     * Update the logged in user's information
     */
    async updateUser() {
        try {
            let user = (await axios.get('/api/users/')).data;
            this.setState({user});
        }
        catch(e) {
            this.setState({error: 'An error occurred while retrieving your user information.'});
        }
    }

    /**
     * Update the list of the logged in user's coins
     */
    async updateCoins() {
        try {
            let coins = (await axios.get('/api/coins/')).data;
            this.setState({coins});
        }
        catch(e) {
            this.setState({error: 'An error occurred while retrieving your coins list.'});
        }
    }

    /**
     * Load more transactions, starting at the lastTransactionId variable in state
     */
    async loadTransactions() {
        try{
            this.setState({loadingTransactions: true});
            const {transactions, lastId} = (await axios.get('/api/transactions/search/' + this.state.lastTransactionId)).data;
            this.setState((previousState) => ({
                lastTransactionId: transactions.length === 10 ? lastId : 0,
                transactions: [...previousState.transactions, ...transactions]
            }));
        }
        catch(e) {
            this.setState({error: 'An error occurred while retrieving your transactions.'})
        }
        this.setState({loadingTransactions: false});
    }

    /**
     * Load more requests, starting at the lastRequestId variable in state
     */
    async loadRequests() {
        try{
            this.setState({loadingRequests: true});
            const {requests, lastId} = (await axios.get('/api/transactions/search/requests/' + this.state.lastRequestId)).data;
            this.setState((previousState) => ({
                lastRequestId: requests.length === 10 ? lastId : 0,
                requests: [...previousState.requests, ...requests]
            }));
        }
        catch(e) {
            this.setState({error: 'An error occurred while retrieving your requests.'})
        }
        this.setState({loadingRequests: false});
    }

    /**
     * Take the transaction information and send it to the server to be created
     * @param transaction The transaction information.
     *
     * The transaction information is:
     * chargeValue: true for charging, false for paying
     * receiver: the person to receive the transaction (or request in case of charging)
     * amount: the amount to be transferred
     * coin: the UUI of the coin for the transaction
     * message: the message to send along with the transaction
     */
    async createTransaction(transaction) {
        const {chargeValue: charging, receiver, amount, coin, message} = transaction;
        this.setState({creatingTransaction: true});

        try {
            await axios.post('/api/transactions/', {
                target: receiver.uuid,
                coin: coin.uuid,
                amount,
                message,
                charging
            });
            await this.updateCoins()
        }
        catch(e) {
            this.setState({error: 'An error occurred while creating your transaction.'})
        }
        this.setState({creatingTransaction: false});
    }
}

export default Home;
