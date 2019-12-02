import React, {Component} from 'react';
import GeneralNavbar from './rightNavbar';
import {NavLink} from "react-router-dom";
import {Drawer, Button} from 'antd';
import Logo from '../../assets/Logo.png'; 

class Navbar extends Component {

    state = {
        current: 'mail',
        visible: false,
        type: "normal"
    }

    showDrawer = () => {
        this.setState({visible: true});
    };
    onClose = () => {
        this.setState({visible: false});
    };

    constructor(props) {
        super(props);

        this.state.type = this.props.type;
    }

    render() {
        return (
            <nav className="menuBar">
                <div className="logo">
                    <NavLink to={"/app/"}>
                        <img src={Logo} alt="Logo"/>
                    </NavLink>
                </div>
                <div className="menuCon">
                    <div className="rightMenu">
                        <GeneralNavbar mode={'horizontal'} type={this.type}/>
                    </div>
                    <Button className="barsMenu" type="primary" onClick={this.showDrawer}>
                        <span className="barsBtn"></span>
                    </Button>
                    <Drawer
                        title="Menu"
                        placement="right"
                        closable={false}
                        onClose={this.onClose}
                        visible={this.state.visible}>
                        <GeneralNavbar mode={'inline'} type={this.type}/>
                    </Drawer>
                </div>
            </nav>
        )
    }
}

export default Navbar;