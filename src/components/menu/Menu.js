import React from "react";
import styles from './Menu.module.css';
import MediaQuery from 'react-responsive';
import {Link} from "react-router-dom";
import UserInformationPanel from "../userInformationPanel/UserInformationPanel";

class Menu extends React.Component {

    state = {
        openNavigationDrawer: false,
        openUserDrawer: false
    };

    render() {
        return <div className={styles.menu}>
            <MediaQuery query={'(max-width: 1023px)'}>
                <div className={styles.mobileMenu}>
                    <i className={[styles.icon, styles.drawerOpenIcon].join(' ')}
                       onClick={() => this.setState(previousState => ({
                           openNavigationDrawer: !previousState.openNavigationDrawer,
                           openUserDrawer: false
                       }))}
                    >
                        <div className={styles.drawerIconPart}/>
                        <div className={styles.drawerIconPart}/>
                        <div className={styles.drawerIconPart}/>
                    </i>
                    <i className={['material-icons', styles.icon].join(' ')}
                       onClick={() => this.setState(previousState => ({
                           openUserDrawer: !previousState.openUserDrawer,
                           openNavigationDrawer: false
                       }))}
                    >
                        person
                    </i>
                </div>
                <div className={[styles.overlay,
                    (this.state.openNavigationDrawer || this.state.openUserDrawer) ? styles.appear : ''].join(' ')}
                     onClick={() => this.setState({
                         openUserDrawer: false,
                         openNavigationDrawer: false
                     })}
                />
                <div className={[styles.userDrawer, this.state.openUserDrawer ? styles.appear : ''].join(' ')}>
                    <UserInformationPanel/>
                </div>

                <div
                    className={[styles.navigationDrawer, this.state.openNavigationDrawer ? styles.appear : ''].join(' ')}>
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
