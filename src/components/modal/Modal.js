import React from "react";
import './Modal.css';
import PropTypes from 'prop-types';

class Modal extends React.Component {

    render() {
        return this.props.visible ? <div className='overlay'>
            <div className='modal'>
                {this.props.children}
            </div>
        </div> : null
    }
}

Modal.propTypes = {
    /**
     * If the modal is currently visible
     */
    visible: PropTypes.bool.isRequired
};

export default Modal;
