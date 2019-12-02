import React, {Component} from 'react';
import {Redirect, NavLink} from 'react-router-dom'
import {ItemPreview, GetProfImg} from '../../util/constants';
import Navbar from '../navbar/navbar.js';
import {Tabs} from 'antd';
import {getOrganizationProfile} from '../../util/APIUtils';

const {TabPane} = Tabs;

class OrganizationPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            organization: null,
            isLoading: true,
            settingClass: "hidden"
        }
        this.loadOrganizationProfile = this
            .loadOrganizationProfile
            .bind(this);
    }

    loadOrganizationProfile(id) {
        this.setState({isLoading: true});

        getOrganizationProfile(id).then(response => {
            this.setState({recipe: response, isLoading: false});

            if(
                this.props.currentUser.name === response.owner.name ||
                this.props.currentUser.roles.includes("ADMIN")
            ){
                this.setState({
                    settingClass : " "
                });
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
        let try_name = this.props.match.params.id;
        const id = try_name;
        this.loadOrganizationProfile(id);
    }

    componentDidUpdate(nextProps) {
        if (this.props.match.params.id !== nextProps.match.params.id) {
            this.loadOrganizationProfile(nextProps.match.params.id);
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
                
                <div className="small-8 small-offset-2 grid-x align-center-middle cell">
                    <GetProfImg
                        className="small-3 cell"
                        pic={this.state.organization.img}
                        alt={this.state.organization.name}
                        type="organization"/>
                </div>

                <div id="redirectOrganization" className="small-2 cell grid-x align-center-middle">
                    <NavLink to={"/app/organization/"+this.props.match.params.id+"/config"} className={"cell grid-x align-center-middle "+this.state.settingClass}>
                        <GetProfImg className="small-3 cell" alt="Settings" type="settings"/>
                    </NavLink>
                </div>

                <h1 id="organizationPageTitle" className="caption small-10 cell">{this.state.organization.name}</h1>

                <div className="small-12 medium-4 grid-x align-center-middle cell">

                    <h1 className="caption small-10 cell">Owner:</h1>
                    <ItemPreview className="small-8 cell" items={[this.state.organization.owner]} type="user"/>

                    <h1 className="eventPageDescTitle captionRed small-10 cell">Desc</h1>
                    <div className="small-10 grid-x grid-margin-x align-center-middle cell">
                        {this.state.organization.description}
                    </div>
                </div>

                <div
                    id="rightEventSide"
                    className="small-12 medium-8 grid-x align-center-middle cell">
                    <h1 id="rightSideTitle" className="captionRed small-10 cell">Organization Info</h1>
                    <Tabs className="small-12 medium-10 cell" tabPosition="right">
                        <TabPane tab="Events" key="1">
                            <div className="grid-x grid-margin-x align-center-middle cell">
                                <ItemPreview className="small-6 cell" items={this.state.organization.events} type="user"/>
                            </div>
                        </TabPane>
                        <TabPane tab="Active Members" key="2">
                            <div className="grid-x grid-margin-x align-center-middle cell">
                                <ItemPreview className="small-6 cell" items={this.state.organization.activeMembers} type="user"/>
                            </div>
                        </TabPane>
                        <TabPane tab="Members" key="2">
                            <div className="grid-x grid-margin-x align-center-middle cell">
                                <ItemPreview className="small-6 cell" items={this.state.organization.members} type="user"/>
                            </div>
                        </TabPane>
                    </Tabs>
                </div>
            </div>
        )
    }
}

export default OrganizationPage;
