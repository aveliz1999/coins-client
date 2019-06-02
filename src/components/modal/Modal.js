import React from "react";
import './Modal.css';

class Modal extends React.Component {

    render() {
        return this.props.visible ? <div className='overlay'>
            <div className='modal'>
                {this.props.children}
            </div>
        </div> : null
    }
}

export default Modal;
