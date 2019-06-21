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
        loadingTransactions: false,
        transactionsAvailable: true,
        requests: [],
        loadingRequests: false,
        requestsAvailable: true
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
                                          updateTransactions={this.loadTransactions}
                                          moreAvailable={this.state.transactionsAvailable}
                                          loading={this.state.loadingTransactions}
                         />
                         <RequestList transactions={this.state.requests}
                                      updateRequests={this.loadRequests}
                                      moreAvailable={this.state.requestsAvailable}
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
    async loadTransactions(uuid = undefined) {
        try{
            this.setState({loadingTransactions: true});

            if(!uuid) {
                uuid = (this.state.transactions[this.state.transactions.length - 1] || {}).uuid || '';
            }
            let existing = this.state.transactions.map(transaction => transaction.uuid);

            let {transactions, moreAvailable} = (await axios.get('/api/transactions/search/' + uuid)).data;
            transactions = transactions.filter(transaction => {
                return !existing.includes(transaction.uuid);
            });
            this.setState((previousState) => ({
                transactions: [...previousState.transactions, ...transactions].sort((first, second) => {
                    return Date.parse(first) - Date.parse(second);
                }),
                transactionsAvailable: moreAvailable
            }));
        }
        catch(e) {
            this.setState({error: 'An error occurred while retrieving your transactions.'})
        }
        this.setState({loadingTransactions: false});
    }

    /**
     * Load more transactions, starting at the lastTransactionId variable in state
     */
    async loadRequests(uuid = undefined) {
        try{
            this.setState({loadingRequests: true});

            if(!uuid) {
                uuid = (this.state.requests[this.state.requests.length - 1] || {}).uuid || ''
            }
            let existing = this.state.requests.map(request => request.uuid);

            let {requests, moreAvailable} = (await axios.get('/api/transactions/search/requests/' + uuid)).data;
            requests = requests.filter(request => {
                return !existing.includes(request.uuid);
            });
            this.setState((previousState) => ({
                requests: [...previousState.requests, ...requests].sort((first, second) => {
                    return Date.parse(first) - Date.parse(second);
                }),
                requestsAvailable: moreAvailable
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
        }
        catch(e) {
            this.setState({error: 'An error occurred while creating your transaction.'})
        }
        this.setState({creatingTransaction: false});

        this.updateCoins();
        if(!charging) {
            this.loadTransactions();
        }
    }
}

export default Home;
