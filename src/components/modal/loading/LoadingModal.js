import React from "react";
import {ClipLoader} from "react-spinners";
import Modal from "../Modal";
import styles from './LoadingModal.module.css'

class LoadingModal extends React.Component {

    render() {
        return <Modal visible={this.props.visible}>
            <p className={styles.title}>{this.props.title}</p>
            <hr className={styles.hr}/>
            <ClipLoader size={120} />
        </Modal>
    }
}

export default LoadingModal;
