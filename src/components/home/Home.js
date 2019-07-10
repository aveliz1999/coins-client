import React from "react";
import styles from './Home.module.scss';
import axios from 'axios';
import TransactionCreator from "../transactionCreator/TransactionCreator";
import TransactionList from "../transactionList/TransactionList";
import MediaQuery from 'react-responsive';
import MessageModal from "../modal/message/MessageModal";
import LoadingModal from "../modal/loading/LoadingModal";
import RequestList from "../requestList/RequestList";
import Tabs from "../tabs/Tabs";
import ConfirmModal from "../modal/confirm/ConfirmModal";
import UserInformationPanel from "../userInformationPanel/UserInformationPanel";
import {addCoins} from "../../actions/ownedCoinsActions";
import {connect} from "react-redux";

class Home extends React.Component {

    constructor(props) {
        super(props);

        this.loadTransactions = this.loadTransactions.bind(this);
        this.loadRequests = this.loadRequests.bind(this);
        this.createTransaction = this.createTransaction.bind(this);
        this.acceptDeclineRequest = this.acceptDeclineRequest.bind(this);
    }

    state = {
        creatingTransaction: false,
        transactions: [],
        loadingTransactions: false,
        transactionsAvailable: true,
        requests: [],
        loadingRequests: false,
        requestsAvailable: true,
        workingRequest: undefined,
        showConfirmAcceptRequest: false,
        showConfirmDeclineRequest: false
    };

    componentDidMount() {
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
                        <RequestList requests={this.state.requests}
                                     updateRequests={this.loadRequests}
                                     moreAvailable={this.state.requestsAvailable}
                                     loading={this.state.loadingRequests}
                                     acceptDeclineRequestCallback={(request, status) => {
                                         this.setState({
                                             workingRequest: request,
                                             [status ? 'showConfirmAcceptRequest' : 'showConfirmDeclineRequest']: true
                                         });
                                     }}
                        />
                    </Tabs>
                </div>
            </div>
            <MediaQuery query='(min-width: 1024px)'>
                <UserInformationPanel user={this.state.user}
                                      coins={this.state.coins}
                />
            </MediaQuery>
            <MessageModal title={'Error'}
                          message={this.state.error}
                          onConfirm={() => this.setState({error: undefined})}
                          visible={this.state.error}
            />
            <LoadingModal title={'Creating Transaction'} visible={this.state.creatingTransaction}/>
            <ConfirmModal title={'Confirm Action'}
                          message={this.state.workingRequest && `Do you want to send ${this.state.workingRequest.user.name} 
                          ${this.state.workingRequest.coin.symbol} ${this.state.workingRequest.amount} for 
                          "${this.state.workingRequest.message}"?`}
                          onConfirm={() => this.acceptDeclineRequest(true)}
                          onDecline={() => this.setState({
                              workingRequest: undefined,
                              showConfirmAcceptRequest: false,
                              showConfirmDeclineRequest: false
                          })}
                          visible={this.state.showConfirmAcceptRequest}
            />
            <ConfirmModal title={'Confirm Action'}
                          message={"Do you want to remove this request?"}
                          onConfirm={() => this.acceptDeclineRequest(false)}
                          onDecline={() => this.setState({
                              workingRequest: undefined,
                              showConfirmAcceptRequest: false,
                              showConfirmDeclineRequest: false
                          })}
                          visible={this.state.showConfirmDeclineRequest}
            />
        </div>
    }

    /**
     * Update the list of the logged in user's coins
     */
    async updateCoins() {
        try {
            let coins = (await axios.get('/api/coins/')).data;
            this.props.updateCoins(coins)
        } catch (e) {
            this.setState({responseError: 'An error occurred while retrieving your coins list.'});
        }
    }

    /**
     * Load more transactions, starting at the lastTransactionId variable in state
     */
    async loadTransactions(uuid = undefined) {
        try {
            this.setState({loadingTransactions: true});

            if (!uuid && typeof (uuid) !== 'string') {
                uuid = (this.state.transactions[this.state.transactions.length - 1] || {}).uuid || '';
            }
            let existing = this.state.transactions.map(transaction => transaction.uuid);

            let {transactions, moreAvailable} = (await axios.get('/api/transactions/search/' + uuid)).data;
            transactions = transactions.filter(transaction => {
                return !existing.includes(transaction.uuid);
            });
            this.setState((previousState) => ({
                transactions: [...previousState.transactions, ...transactions].sort((first, second) => {
                    return Date.parse(second.timestamp) - Date.parse(first.timestamp);
                }),
                transactionsAvailable: moreAvailable
            }));
        } catch (e) {
            this.setState({error: 'An error occurred while retrieving your transactions.'})
        }
        this.setState({loadingTransactions: false});
    }

    /**
     * Load more transactions, starting at the lastTransactionId variable in state
     */
    async loadRequests(uuid = undefined) {
        try {
            this.setState({loadingRequests: true});

            if (!uuid && typeof (uuid) !== 'string') {
                uuid = (this.state.requests[this.state.requests.length - 1] || {}).uuid || ''
            }
            let existing = this.state.requests.map(request => request.uuid);

            let {requests, moreAvailable} = (await axios.get('/api/transactions/search/requests/' + uuid)).data;
            requests = requests.filter(request => {
                return !existing.includes(request.uuid);
            });
            this.setState((previousState) => ({
                requests: [...previousState.requests, ...requests].sort((first, second) => {
                    return Date.parse(second.timestamp) - Date.parse(first.timestamp);
                }),
                requestsAvailable: moreAvailable
            }));
        } catch (e) {
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
        } catch (e) {
            this.setState({error: 'An error occurred while creating your transaction.'})
        }
        this.setState({creatingTransaction: false});

        if (!charging) {
            this.loadTransactions('');
            this.updateCoins()
        }
    }

    /**
     * Accept or decline a request
     *
     * @param status Whether to accept or decline the working request
     */
    async acceptDeclineRequest(status) {
        const request = this.state.workingRequest;
        this.setState({
            workingRequest: undefined,
            showConfirmAcceptRequest: false,
            showConfirmDeclineRequest: false
        });

        let url = '/api/transactions/' + (status ? 'acceptRequest' : 'declineRequest');

        await axios.post(url, {
            requestId: request.uuid
        });

        this.loadTransactions('');
        this.setState(previousState => {
            return {
                requests: previousState.requests.filter(filterRequest => filterRequest.uuid !== request.uuid)
            }
        });
    }
}

const mapActionsToProps = {
    updateCoins: addCoins
};

export default connect(undefined, mapActionsToProps)(Home);
