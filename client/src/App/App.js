import React, {Component} from 'react';
import history from './util/history';
import Routes from './util/route';

import {getCurrentUser} from './util/APIUtils';
import * as constant from './util/constants';
import {notification} from 'antd';

class App extends Component {

    state = {
        currentUser: null,
        isAuthenticated: false,
        isLoading: true
    }

    constructor(props) {
        super(props);
        this.handleLogout = this
            .handleLogout
            .bind(this);
        this.loadCurrentUser = this
            .loadCurrentUser
            .bind(this);
        this.handleLogin = this
            .handleLogin
            .bind(this);
    }

    async componentDidMount(){
        await this.loadCurrentUser();
    }

    async loadCurrentUser() {
        this.setState({isLoading:true});

        return new Promise(function (resolve, reject) {
            getCurrentUser().then(user => {
                this.state.currentUser = user; 
                this.state.isAuthenticated = true;
                this.setState({isLoading:false});
                resolve(user);
            }).catch(error => {
                this.setState({isLoading:false});
                reject(error);
            });

        }.bind(this));

    }

    handleLogout(notificationType = "success", description = "You're successfully logged out.") {
        localStorage.removeItem(constant.ACCESS_TOKEN);

        this.setState({
            currentUser: null, 
            isAuthenticated: false
        });

        history.push("/");
        window.location.reload();

        notification[notificationType]({message: constant.APP_NAME, description: description});
    }

    async handleLogin() {
        await this.loadCurrentUser();
        history.push("/app/");
        window.location.reload();
        notification.success({message: constant.APP_NAME, description: "You're successfully logged in."});
    }

    render() {
        console.log("Authenticated: "+this.state.isAuthenticated);
        if(this.state.isLoading){
            return null;
        }
        return <Routes state={this.state} onLogin={this.handleLogin} onLogout={this.handleLogout}/>
    }

}

export default App;