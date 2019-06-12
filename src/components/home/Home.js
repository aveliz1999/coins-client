import React from "react";
import styles from './Home.module.scss';
import axios from 'axios';
import TransactionCreator from "../transactionCreator/TransactionCreator";
import TransactionList from "../transactionList/TransactionList";
import MediaQuery from 'react-responsive';
import CoinsList from "../coinsList/CoinsList";
import MessageModal from "../modal/message/MessageModal";
import LoadingModal from "../modal/loading/LoadingModal";

class Home extends React.Component {

    constructor(props) {
        super(props);

        this.updateUser = this.updateUser.bind(this);
        this.updateCoins = this.updateCoins.bind(this);
        this.updateTransactions = this.updateTransactions.bind(this);
        this.createTransaction = this.createTransaction.bind(this);
    }


    state = {
        user: undefined,
        coins: [],
        creatingTransaction: false,
        transactions: [],
        lastTransactionId: Number.MAX_SAFE_INTEGER,
        loadingTransactions: false
    };

    componentDidMount() {
        this.updateUser();
        this.updateCoins();
        this.updateTransactions();
    }

    render() {
        return <div className={styles.container}>
            <div className={styles.transactionsPanel}>
                <TransactionCreator coins={this.state.coins}
                                    submit={this.createTransaction}
                />
                <TransactionList transactions={this.state.transactions}
                                 updateTransactions={this.updateTransactions}
                                 moreAvailable={this.state.lastTransactionId > 0}
                                 loading={this.state.loadingTransactions}
                />
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

    async updateUser() {
        try {
            let user = (await axios.get('/api/users/')).data;
            this.setState({user});
        }
        catch(e) {
            this.setState({error: 'An error occurred while retrieving your user information.'});
        }
    }

    async updateCoins() {
        try {
            let coins = (await axios.get('/api/coins/')).data;
            this.setState({coins});
        }
        catch(e) {
            this.setState({error: 'An error occurred while retrieving your coins list.'});
        }
    }

    async updateTransactions() {
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
