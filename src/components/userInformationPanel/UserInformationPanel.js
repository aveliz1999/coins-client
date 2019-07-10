import React from "react";
import PropTypes from 'prop-types';
import CoinsList from "../coinsList/CoinsList";
import styles from './UserInformationPanel.module.css';
import {connect} from "react-redux";

class UserInformationPanel extends React.Component {

    render() {
        return <div className={styles.informationPanel}>
            {this.props.user &&
            <>
                <div className={styles.userInformation}>
                    <img className={styles.userThumbnail}
                         src={'/media/users/' + this.props.user.uuid + '/thumbnail.jpg'}/>
                    <p className={styles.userName}>{this.props.user.name}</p>
                </div>
                <hr/>
            </>
            }
            <CoinsList coins={this.props.coins}/>
        </div>
    }
}

UserInformationPanel.propTypes = {
    /**
     * The information of the current user.
     * Passed by redux.
     */
    user: PropTypes.shape({
        /**
         * User email
         */
        email: PropTypes.string.isRequired,
        /**
         * User name
         */
        name: PropTypes.string.isRequired,
        /**
         * User UUID
         */
        uuid: PropTypes.string.isRequired
    }).isRequired,
    /**
     * List of coins the user owns.
     * Passed by redux.
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

const mapStateToProps = state => ({
    user: state.user,
    coins: state.ownedCoins
});

export default connect(mapStateToProps)(UserInformationPanel);
