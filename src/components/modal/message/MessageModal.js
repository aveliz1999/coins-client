import React from "react";
import Modal from "../Modal";
import styles from "./MessageModal.module.css";
import PropTypes from 'prop-types';

class MessageModal extends React.Component {

    render() {
        return <Modal visible={this.props.visible}>
            <span className={styles.title}>{this.props.title}</span>
            <span className={styles.message}>{this.props.message}</span>
            <div className={styles.bottom}>
                <button
                    onClick={
                        event => this.props.onConfirm()
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

MessageModal.propTypes = {
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
    onConfirm: PropTypes.func.isRequired,
    /**
     * Text to display in the confirm button.
     * Defaults to 'Ok'
     */
    confirmText: PropTypes.string
};

export default MessageModal;
