import React from "react";
import styles from './UserOption.module.css';
import PropTypes from 'prop-types';

class UserOption extends React.Component {

    render() {
        return <div ref={this.props.innerRef} className={styles.option} {...this.props.innerProps}>
            <img className={styles.thumbnail} src={'/media/users/' + this.props.data.uuid + '/thumbnail.jpg'}/>
            <div className={styles.information}>
                <span>{this.props.data.name}</span>
                <span>{this.props.data.email}</span>
            </div>
        </div>
    }
}

UserOption.propTypes = {
    innerRef: PropTypes.any,
    innerProps: PropTypes.any,
    data: PropTypes.shape({
        label: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
        uuid: PropTypes.string.isRequired
    }).isRequired
};

export default UserOption;
