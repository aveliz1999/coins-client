import React from "react";
import Modal from "../Modal";
import styles from "./MessageModal.module.css";

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

export default MessageModal;
