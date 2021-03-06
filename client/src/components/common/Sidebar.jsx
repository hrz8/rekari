import React, { Component } from 'react';
import { Link, withRouter, NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faUserAlt,
    faThLarge,
    faSignInAlt,
    faBox} from '@fortawesome/free-solid-svg-icons';
import logo from '../../logo.png';
import { connect } from 'react-redux';

class Sidebar extends Component {
    render() {
        return (
            <div id="slide-out" className="side-nav bg-admin-sidebar fixed">
                <ul className="custom-scrollbar">
                    <li>
                        <div className="logo-wrapper reset-border waves-light">
                            <Link to="/">
                                <img src={logo} className="img-fluid flex-center" alt="logo"></img>
                            </Link>
                        </div>
                    </li>
                    <li>
                        <ul className="collapsible">
                            {this.props.auth === null &&
                                <>
                                    <li>
                                        <a href="/#" className="collapsible-header disable-anchor waves-effect arrow-r">Portal</a>
                                        <div className="collapsible-body d-block">
                                            <ul>
                                                <li>
                                                    <NavLink to="/login" className="waves-effect pl-4"><FontAwesomeIcon icon={faSignInAlt} />&emsp;Login</NavLink>
                                                </li>
                                            </ul>
                                        </div>
                                    </li>
                                </>
                            }
                            {/* <li>
                                <div className="collapsible-body d-block">
                                    <ul>
                                        <li>
                                            <a href="games.html" className="waves-effect pl-4"><FontAwesomeIcon icon={faLongArrowAltLeft} />&emsp;Back</a>
                                        </li>
                                    </ul>
                                </div>
                            </li> */}
                            {this.props.auth &&
                                <>
                                    <li>
                                        <a href="/#" className="collapsible-header disable-anchor waves-effect arrow-r">Pengguna</a>
                                        <div className="collapsible-body d-block">
                                            <ul>
                                                <li>
                                                    <NavLink to="/dashboard/operator" className="waves-effect pl-4"><FontAwesomeIcon icon={faUserAlt} />&emsp;Operator</NavLink>
                                                </li>
                                            </ul>
                                        </div>
                                    </li>
                                    <li>
                                        <a href="/#" className="collapsible-header disable-anchor waves-effect arrow-r">Part</a>
                                        <div className="collapsible-body d-block">
                                            <ul>
                                                <li>
                                                    <NavLink to="/dashboard/tipe-part" className="waves-effect pl-4"><FontAwesomeIcon icon={faThLarge} />&emsp;Tipe</NavLink>
                                                </li>
                                            </ul>
                                        </div>
                                    </li>
                                    <li>
                                        <a href="/#" className="collapsible-header disable-anchor waves-effect arrow-r">Work</a>
                                        <div className="collapsible-body d-block">
                                            <ul>
                                                <li>
                                                    <NavLink to="/dashboard/work-subassy" className="waves-effect pl-4"><FontAwesomeIcon icon={faBox} />&emsp;Sub Assy</NavLink>
                                                </li>
                                            </ul>
                                        </div>
                                    </li>
                                </>
                            }
                        </ul>
                    </li>
                </ul>
                <div className="sidenav-bg mask-strong"></div>
            </div>
        )
    }
}

const mapState = (state) => ({
    auth: state.auth
});

export default connect(mapState)(withRouter(Sidebar));
