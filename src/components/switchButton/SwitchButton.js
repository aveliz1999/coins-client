import React from "react";
import styles from './SwitchButton.module.css';
import PropTypes from 'prop-types';

class SwitchButton extends React.Component {

    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.toggleAnimation = this.toggleAnimation.bind(this);

        this.textSpan = React.createRef();
    }

    state = {
        value: this.props.value,
        textValue: this.props.text,
        primaryColor: this.props.primaryColor || '#86d993',
        secondaryColor: this.props.secondaryColor || '#FF3A19'
    };

    componentDidMount() {
        if(!this.state.value) {
            this.textSpan.current.classList.add('switch-text-rotate-in');
            this.setState({textValue: this.props.secondaryText || this.props.text})
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        // If the value prop changed, update the local state value
        if(prevProps.value !== this.props.value) {
            this.toggle();
        }
    }

    render() {
        const backgroundStyle = {
            backgroundColor: this.state.value ? this.state.primaryColor : this.state.secondaryColor
        };

        return <button className={[styles.switch, this.state.value ? '' : styles.switchSecondary].join(' ')}
                       style={backgroundStyle}
                       onClick={() => this.toggle(true)}>
            <span ref={this.textSpan} className={styles.switchText}
                  style={{width: this.props.width || '4em'}}
                  onTransitionEnd={this.toggleAnimation}>
                {this.state.textValue}
            </span>
        </button>
    }

    toggle(fromClick = false) {
        // If the toggle comes from the button click and the button is toggleable, trigger the parent state toggle
        if(fromClick && this.props.toggleable) {
            this.props.toggle();
        }
        // If the toggle comes from the prop change directly, update the local state and trigger the animation
        else if (!fromClick) {
            this.setState((previousState) => {
                return {value: !previousState.value}
            }, () => {
                this.textSpan.current.classList.remove(styles.switchTextRotateNone);
                this.textSpan.current.classList.remove(styles.switchTextRotateIn);
                this.textSpan.current.classList.add(styles.switchTextRotate);
            });
        }
    }

    toggleAnimation() {
        // If the span contains the class, the transition was a rotate 90deg transition and the value/rotation must be changed
        if (this.textSpan.current.classList.contains(styles.switchTextRotate)) {
            // Remove the 90deg rotation
            this.textSpan.current.classList.remove(styles.switchTextRotate);
            if (this.state.value) {
                // If the button value is positive set the button text to the primary and set rotation to 0deg
                this.setState({textValue: this.props.text}, () => {
                    this.textSpan.current.classList.add(styles.switchTextRotateNone);
                });
            } else {
                // If the button value is negative set the button text to the secondary and set rotation to 180deg to match the button
                this.setState({textValue: this.props.secondaryText || this.props.text}, () => {
                    this.textSpan.current.classList.add(styles.switchTextRotateIn);
                });
            }
        }
    }
}

SwitchButton.propTypes = {
    /**
     * Value of the switch
     */
    value: PropTypes.bool.isRequired,
    /**
     * Primary text to display when the value is true
     */
    text: PropTypes.string.isRequired,
    /**
     * Secondary text to display when the value is false.
     * Defaults to the primary text value
     */
    secondaryText: PropTypes.string,
    /**
     * Color to display when the value is true.
     * Defaults to #86d993
     */
    primaryColor: PropTypes.string,
    /**
     * Color to display when the value is false.
     * Defaults to #FF3A19
     */
    secondaryColor: PropTypes.string,
    /**
     * If the switch can be toggled by clicking on it
     */
    toggleable: PropTypes.bool.isRequired,
    /**
     * Function to call when the switch is clicked and needs to be toggled
     */
    toggle: PropTypes.func.isRequired,
    /**
     * Width of the text.
     * Defaults to 4em
     */
    width: PropTypes.number
};

export default SwitchButton;
