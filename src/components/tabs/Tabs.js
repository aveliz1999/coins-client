import React from "react";
import styles from './Tabs.module.css';
import PropTypes from 'prop-types';

class Tabs extends React.Component {

    state = {
        tab: 0
    };

    render() {
        return <div>
            <div className={styles.tabs}>
                {
                    this.props.tabs.map((tab, index) =>
                        <span key={tab} className={[styles.tab, this.state.tab === index ? styles.active : ''].join(' ')}
                              onClick={() => {
                                  if(index !== this.state.tab) {
                                      this.setState({tab: index});
                                  }
                              }}
                        >
                            {tab}
                        </span>
                    )
                }
            </div>
            {this.props.children[this.state.tab]}
        </div>
    }
}

Tabs.propTypes = {
    /**
     * Name of the tabs. The size should match up with the amount of children
     */
    tabs: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default Tabs;
