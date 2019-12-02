import React, {Component} from 'react';
import {NavLink} from "react-router-dom";
import {Menu, Icon} from 'antd';

const {SubMenu} = Menu;

var isFirefox = typeof InstallTrigger !== 'undefined';

class GeneralNavbar extends Component {

    constructor(props) {
        super(props);

        this.type = this.props.type;
    }

    render() {
        return (
            <Menu theme="dark" mode={this.props.mode}>

                {/* Search */}
                <Menu.Item key="search">
                    <NavLink
                        to="/app/search"
                        isActive={(match, location) => {
                        if (!match) {
                            return false;
                        }
                        const eventID = parseInt(match.params.eventID);
                        return !isNaN(eventID) && eventID % 2 === 1;
                    }}>
                        <Icon type="search"/>
                        Search
                    </NavLink>
                </Menu.Item>

                {/* My Bars */}
                <Menu.Item key="myEvents">
                    <NavLink
                        to="/app/myEvents"
                        isActive={(match, location) => {
                        if (!match) {
                            return false;
                        }
                        const eventID = parseInt(match.params.eventID);
                        return !isNaN(eventID) && eventID % 2 === 1;
                    }}>
                        <Icon type="smile" theme="twoTone" twoToneColor="#A0A0A0"/>
                        My Events
                    </NavLink>
                </Menu.Item>

                {/* My Organizations */}
                <Menu.Item key="myOrganizations">
                    <NavLink
                        to="/app/myOrganizations"
                        isActive={(match, location) => {
                        if (!match) {
                            return false;
                        }
                        const eventID = parseInt(match.params.eventID);
                        return !isNaN(eventID) && eventID % 2 === 1;
                    }}>
                        <Icon type="shop" theme="twoTone" twoToneColor="#A0A0A0"/>
                        My Orgs
                    </NavLink>
                </Menu.Item>

                {/* Account */}
                <SubMenu title={<span> <Icon type="user"/> Account </span>}>
                    <Menu.Item key="Account:1">
                        <NavLink
                            to="/app/user/me"
                            isActive={(match, location) => {
                            if (!match) {
                                return false;
                            }
                            const eventID = parseInt(match.params.eventID);
                            return !isNaN(eventID) && eventID % 2 === 1;
                        }}>
                            <Icon type="user"/>
                            My Profile
                        </NavLink>
                    </Menu.Item>

                    <Menu.Item key="setting:2">
                        <NavLink
                            to="/app/user/me/config"
                            isActive={(match, location) => {
                            if (!match) {
                                return false;
                            }
                            const eventID = parseInt(match.params.eventID);
                            return !isNaN(eventID) && eventID % 2 === 1;
                        }}>
                            <Icon type="tool" theme="twoTone" twoToneColor="#A0A0A0"/>
                            Settings
                        </NavLink>
                    </Menu.Item>

                    <Menu.Item key="setting:3">
                        <NavLink
                            to="/logout"
                            isActive={(match, location) => {
                            if (!match) {
                                return false;
                            }
                            const eventID = parseInt(match.params.eventID);
                            return !isNaN(eventID) && eventID % 2 === 1;
                        }}>
                            <Icon type="logout"/>
                            Log Out
                        </NavLink>
                    </Menu.Item>
                </SubMenu>

            </Menu>
        )
    }
} 

export default GeneralNavbar;