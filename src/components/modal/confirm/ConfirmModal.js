import React from "react";
import Modal from "../Modal";
import styles from "./ConfirmModal.module.css";
import PropTypes from 'prop-types';

class ConfirmModal extends React.Component {

    render() {
        return <Modal visible={this.props.visible}>
            <span className={styles.title}>{this.props.title}</span>
            <span className={styles.message}>{this.props.message}</span>
            <div className={styles.bottom}>
                <button className={styles.decline}
                    onClick={
                        event => this.props.onDecline && this.props.onDecline()
                    }
                >
                    {
                        this.props.declineText || 'Cancel'
                    }
                </button>
                <button className={styles.confirm}
                    onClick={
                        event => this.props.onConfirm && this.props.onConfirm()
                    }
                >
                    {
                        this.props.confirmText || 'Ok'
                    }
                </button>
            </div>
        </Modal>
    }
}

ConfirmModal.propTypes = {
    /**
     * If the modal is currently visible
     */
    visible: PropTypes.bool,
    /**
     * The title to display with the message
     */
    title: PropTypes.string.isRequired,
    /**
     * Message to display
     */
    message: PropTypes.string.isRequired,
    /**
     * Function to call when the user clicks the confirm button
     */
    onConfirm: PropTypes.func,
    /**
     * Function to call when the user clicks the decline button
     */
    onDecline: PropTypes.func,
    /**
     * Text to display in the confirm button.
     * Defaults to 'Ok'
     */
    confirmText: PropTypes.string,
    /**
     * Text to display in the decline button.
     * Defaults to 'Cancel'
     */
    declineText: PropTypes.string
};

export default ConfirmModal;
