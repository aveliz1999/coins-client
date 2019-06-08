import React from "react";
import styles from './Modal.module.css';
import PropTypes from 'prop-types';

class Modal extends React.Component {

    render() {
        return this.props.visible ? <div className={styles.overlay}>
            <div className={styles.modal}>
                {this.props.children}
            </div>
        </div> : null
    }
}

Modal.propTypes = {
    /**
     * If the modal is currently visible
     */
    visible: PropTypes.bool
};

export default Modal;
