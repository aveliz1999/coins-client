import React from "react";
import PropTypes from 'prop-types';
import styles from './CoinSelector.module.css';

class CoinSelector extends React.Component {

    render() {
        return <div className={styles.selector}>
            {
                this.props.coins.map(coin => <div className={styles.coin} onClick={() => this.props.onSelect(coin)}>
                    <img src={'/media/coins/' + coin.uuid + '/thumbnail.jpg'} className={styles.image}/>
                    <div className={styles.coinInformation}>
                        <span>{coin.name}</span>
                        <span>{coin.symbol + (coin.amount / 100.0)}</span>
                    </div>
                </div>)
            }
        </div>
    }
}

CoinSelector.propTypes = {
    /**
     * List of coins the user can choose from
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
    })).isRequired,
    /**
     * Function to be called when a coin is selected
     */
    onSelect: PropTypes.func.isRequired
};

export default CoinSelector;
