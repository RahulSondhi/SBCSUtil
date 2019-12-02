import {Component} from 'react';

class Logout extends Component {
    render() {
        return(this.props.onLogout());
    }
}

export default Logout;
