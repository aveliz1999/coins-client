import React from "react";
import {ClipLoader} from "react-spinners";
import Modal from "../Modal";
import styles from './LoadingModal.module.css'
import PropTypes from 'prop-types';

class LoadingModal extends React.Component {

    render() {
        return <Modal visible={this.props.visible}>
            <p className={styles.title}>{this.props.title}</p>
            <hr className={styles.hr}/>
            <ClipLoader size={120} />
        </Modal>
    }
}

LoadingModal.propTypes = {
    /**
     * If the modal is currently visible
     */
    visible: PropTypes.bool.isRequired,
    /**
     * The title to display with the loading spinner
     */
    title: PropTypes.string.isRequired
};

export default LoadingModal;
