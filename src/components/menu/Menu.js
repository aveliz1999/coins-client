import React from "react";
import styles from './Menu.module.css';
import MediaQuery from 'react-responsive';
import {Link} from "react-router-dom";
import PropTypes from 'prop-types';

class Menu extends React.Component {

    state = {
        openNavigationDrawer: false
    };

    render() {
        return <div className={styles.menu}>
            <MediaQuery query={'(max-width: 1023px)'}>
                <div className={styles.mobileMenu}>
                    <i className={[styles.icon, styles.drawerOpenIcon].join(' ')}
                       onClick={event => this.setState(previousState => {
                           return {openNavigationDrawer: !previousState.openNavigationDrawer}
                       })}
                    >
                        <div className={styles.drawerIconPart}/>
                        <div className={styles.drawerIconPart}/>
                        <div className={styles.drawerIconPart}/>
                    </i>
                    <i className={['material-icons', styles.icon].join(' ')}>
                        person
                    </i>
                </div>
                <div className={[styles.overlay, this.state.openNavigationDrawer ? styles.appear : ''].join(' ')}/>
                <div className={[styles.navigationDrawer, this.state.openNavigationDrawer ? styles.appear : ''].join(' ')}>

                </div>

                <div className={[styles.navigationDrawer, this.state.openNavigationDrawer ? styles.appear : ''].join(' ')}>
                    <div>
                        {
                            this.props.links.map(link =>
                                <Link to={link.link} className={styles.drawerLink}>
                                    <i className={['material-icons', styles.drawerIcon].join(' ')}>{link.icon}</i>
                                    {link.label}
                                </Link>
                            )
                        }
                    </div>
                </div>
            </MediaQuery>

            <MediaQuery query={'(min-width: 1024px)'}>
                <div className={styles.desktopMenu}>
                    {
                        this.props.links.map(link =>
                            <Link to={link.link} className={styles.link}>
                                {link.label}
                            </Link>
                        )
                    }
                </div>
            </MediaQuery>
        </div>
    }
}

export default Menu;
