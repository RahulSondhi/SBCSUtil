import React, {Component} from 'react';
import {Redirect, NavLink} from 'react-router-dom'
import {ItemPreview, GetProfImg} from '../../util/constants';
import Navbar from '../navbar/navbar.js';
import {Tabs} from 'antd';
import {getUserProfile} from '../../util/APIUtils';

const {TabPane} = Tabs;

class UserPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            isLoading: true,
            settingClass: "hidden"
        }
        this.loadUserProfile = this
            .loadUserProfile
            .bind(this);
    }

    loadUserProfile(name) {
        this.setState({isLoading: true});

        getUserProfile(name).then(response => {

            if(this.props.currentUser.name === response.name ||
                this.props.currentUser.roles.includes("ADMIN")){
                this.setState({
                    settingClass : " "
                });
            }

            this.setState({user: response, isLoading: false});
        }).catch(error => {
            if (error.status === 404) {
                this.setState({notFound: true, isLoading: false});
            } else {
                this.setState({serverError: true, isLoading: false});
            }
        });
    }

    componentDidMount() {
        let try_name = "";
        if (this.props.match.params.id === "me"){
            try_name = this.props.currentUser.name;
            const name = try_name;
            this.loadUserProfile(name);
        }else if (this.props.currentUser.name === this.props.match.params.id){
            try_name = this.props.currentUser.name;
            const name = try_name;
            this.loadUserProfile(name);
        }else if (this.props.currentUser.roles.includes("ADMIN")){
            try_name = this.props.match.params.id;
            const name = try_name;
            this.loadUserProfile(name);
        }else{
            this.setState({notFound: true, isLoading: false});
        }
    }

    componentDidUpdate(nextProps) {
        if (this.props.match.params.nickname !== nextProps.match.params.nickname) {
            this.loadUserProfile(nextProps.match.params.nickname);
        }
    }

    render() {

        // Checking if data came in
        if (this.state.isLoading) {
            return null
        }

        // Checking response
        if (this.state.notFound === true || this.state.serverError === true) {
            return <Redirect
                to={{
                pathname: "/app/error",
                state: {
                    from: this.props.location,
                    notFound: this.state.notFound,
                    serverError: this.state.serverError
                }
            }}/>
        }

        return (
            <div className="grid-x align-center-middle">
                <Navbar/>
                <h1 id="userPageTitle" className="caption small-8 small-offset-2 cell">{this.state.user.name}</h1>
                
                <div id="redirectUser" className="small-2 cell grid-x align-center-middle">
                    <NavLink to={"/app/user/"+this.state.user.name+"/config"} className={"cell grid-x align-center-middle "+this.state.settingClass}>
                        <GetProfImg className="small-3 cell" alt="Settings" type="settings"/>
                    </NavLink>
                </div>

                <div
                    id="leftProfileSide"
                    className="small-12 medium-4 grid-x align-center-middle cell">

                    <GetProfImg
                        className="small-4 cell"
                        pic={this.state.user.img}
                        alt={this.state.user.name}
                        type="user"/>
                    <h1 id="userPageFullName" className="caption small-10 cell">{this.state.user.fullName}</h1>
                    <h1 id="userPageBarTitle" className="captionRed small-10 cell">Bio</h1>
                    <div
                        className="userPageBarScroll small-10 grid-x grid-margin-x align-center-middle cell">
                        <div
                            className="userPageBarContainer grid-x grid-margin-x align-center align-top cell">
                            <ItemPreview className="cell" items={this.state.user.bio} type="bar"/>
                            
                        </div>
                    </div>
                </div>
                <div
                    id="rightProfileSide"
                    className="small-12 medium-8 grid-x align-center-middle cell">
                    <h1 id="userPageBarTitle" className="captionRed small-10 cell">Acct Info</h1>
                    <Tabs className="small-12 medium-10 cell" tabPosition="right">
                        <TabPane tab="Organization" key="1">
                            <div className="grid-x grid-margin-x align-center-middle cell">
                                <ItemPreview
                                    className="small-6 cell"
                                    items={this.state.user.organizations}
                                    type="recipe"/>
                            </div>
                        </TabPane>
                        <TabPane tab="Events" key="2">
                            <div className="grid-x grid-margin-x align-center-middle cell">
                                <ItemPreview
                                    className="small-6 cell"
                                    items={this.state.user.events}
                                    type="recipe"/>
                            </div>
                        </TabPane>
                    </Tabs>
                </div>
            </div>
        )
    }
};

export default UserPage;