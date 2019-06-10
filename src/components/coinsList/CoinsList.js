import React from "react";
import styles from './CoinsList.module.css';
import PropTypes from 'prop-types';

class CoinsList extends React.Component {

    render() {
        return <div className={styles.coins}>
            {
                this.props.coins.map(coin => {
                    return <>
                        <div className={styles.coin}>
                            <img className={styles.thumbnail} src={'/media/coins/' + coin.uuid + '/thumbnail.jpg'}/>
                            <div className={styles.coinInformation}>
                                <span>{coin.name}</span>
                                <span>{coin.symbol + (coin.amount / 100.0)}</span>
                            </div>
                        </div>
                        <hr/>
                    </>
                })
            }
        </div>
    }
}

CoinsList.propTypes = {
    /**
     * List of coins to display
     */
    coins: PropTypes.arrayOf(PropTypes.shape({
        /**
         * Amount of the coin the user owns
         */
        amount: PropTypes.number.isRequired,
        /**
         * The name of the coin
         */
        name: PropTypes.string.isRequired,
        /**
         * The symbol of the coin
         */
        symbol: PropTypes.string.isRequired,
        /**
         * The UUID of the coin
         */
        uuid: PropTypes.string.isRequired
    })).isRequired
};

export default CoinsList;
