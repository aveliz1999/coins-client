import React from "react";
import styles from './CoinOption.module.css';
import PropTypes from 'prop-types';

class CoinOption extends React.Component {

    render() {
        return <div ref={this.props.innerRef} className={styles.option} {...this.props.innerProps}>
            <img className={styles.thumbnail} src={'/media/users/' + this.props.data.uuid + '/thumbnail.jpg'}/>
            <div className={styles.information}>
                <span>{this.props.data.name}</span>
                <span>{this.props.data.symbol + (this.props.data.amount / 100)}</span>
            </div>
        </div>
    }
}

CoinOption.propTypes = {
    innerRef: PropTypes.any,
    innerProps: PropTypes.any,
    data: PropTypes.shape({
        amount: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        symbol: PropTypes.string.isRequired,
        uuid: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired
    }).isRequired
};

export default CoinOption;
