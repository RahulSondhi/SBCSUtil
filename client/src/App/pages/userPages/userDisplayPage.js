import React, {Component} from 'react';
import {Redirect, Link} from 'react-router-dom'
import Navbar from '../navbar/navbar.js';

import {ItemPreview, GetProfImg} from '../../util/constants';

import {getUserProfile} from '../../util/APIUtils';

class UsersDisplayPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: null,
            type: this.props.type,
            isLoading: true,
            title: "",
            customFirstButton: "div"
        }

        this.loadUserProfile = this
            .loadUserProfile
            .bind(this);

        this.loadEquipment = this
            .loadEquipment
            .bind(this);
    }

    loadUserProfile(nickname) {
        this.setState({isLoading: true});

        getUserProfile(nickname).then(response => {
            if(this.state.type === "event"){
                const title = response.name + "'s Events";
                this.setState({data: response.events, isLoading: false, title: title, customFirstButton:addEventButton});
            }else if(this.state.type === "organization"){
                const title = response.name + "'s Organizations";
                this.setState({data: response.organizations, isLoading: false, title: title, customFirstButton:addOrganizationButton});
            }
        }).catch(error => {
            if (error.status === 404) {
                this.setState({notFound: true, isLoading: false});
            } else {
                this.setState({serverError: true, isLoading: false});
            }
        });
    }

    componentDidMount() {
        let try_name = this.props.currentUser.name;
        const name = try_name;
        this.loadUserProfile(name);
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
            <div className="grid-x grid-x-margin align-center-middle">
                <Navbar/>

                <h1 id="userBarsPageTitle" className="caption small-10 cell">{this.state.title}</h1>

                <div className="grid-x align-center align-top small-10 cell">

                    <this.state.customFirstButton />

                    <ItemPreview
                        className="small-6 medium-3 cell"
                        items={this.state.data}
                        type={this.state.type}/>

                </div>
            </div>
        )
    }
}

class addOrganizationButton extends Component{
    render(){
        return(
        <Link
            to="/app/createOrganization"
            className="previewItem grid-x align-center-middle small-6 medium-3 cell"
            key="add">
            <div className="small-4 grid-x cell">
                <GetProfImg type="add" className="small-10 cell" pic="" alt="Add An Org"/>
            </div>
            <div className="small-8 grid-x cell">
                <div className="previewName cell">Add An Org</div>
            </div>
        </Link>);
    }
}

class addEventButton extends Component{
    render(){
        return(
            <Link
            to="/app/createEvent"
            className="previewItem grid-x align-center-middle small-6 medium-3 cell"
            key="add">
            <div className="small-4 grid-x cell">
                <GetProfImg type="add" className="small-10 cell" pic="" alt="Add An Event"/>
            </div>
            <div className="small-8 grid-x cell">
                <div className="previewName cell">Add An Event</div>
            </div>
        </Link>);
    }
}

export default UsersDisplayPage;
