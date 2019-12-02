import React, {Component} from 'react';
import {Redirect, NavLink} from 'react-router-dom'
import {ItemPreview, GetProfImg} from '../../util/constants';
import Navbar from '../navbar/navbar.js';
import {Tabs} from 'antd';
import {getEventProfile} from '../../util/APIUtils';

const {TabPane} = Tabs;

class EventPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            event: null,
            isLoading: true,
            settingClass: "hidden"
        }
        this.loadEventProfile = this
            .loadEventProfile
            .bind(this);
    }

    componentDidMount() {
        let try_name = this.props.match.params.id;
        const id = try_name;
        this.loadEventProfile(id);
    }

    loadEventProfile(id) {
        this.setState({isLoading: true});

        getEventProfile(id).then(response => {
            this.setState({event: response, isLoading: false});

            if(
                this.props.currentUser.name === response.host.name ||
                this.props.currentUser.roles.includes("ADMIN") ||
                response.managers.some(item => item.name === this.props.currentUser.name)){
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

    componentDidUpdate(nextProps) {
        if (this.props.match.params.id !== nextProps.match.params.id) {
            this.loadEventProfile(nextProps.match.params.id);
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
            <div className="grid-x grid-x-margin align-center-middle">

                <Navbar/>

                <div className="small-8 small-offset-2 grid-x align-center-middle cell">
                    <GetProfImg
                        className="small-3 cell"
                        pic={this.state.event.img}
                        alt={this.state.event.name}
                        type="event"/>
                </div>

                <div id="redirectEvent" className="small-2 cell grid-x align-center-middle">
                    <NavLink to={"/app/event/"+this.props.match.params.id+"/config"} className={"cell grid-x align-center-middle "+this.state.settingClass}>
                        <GetProfImg className="small-3 cell" alt="Settings" type="settings"/>
                    </NavLink>
                </div>

                <h1 id="eventPageTitle" className="caption small-10 cell">{this.state.event.name}</h1>

                <div className="small-12 medium-4 grid-x align-center-middle cell">

                    <h1 className="caption small-10 cell">Host:</h1>
                    <ItemPreview className="small-8 cell" items={[this.state.event.host]} type="user"/>

                    <h1 className="eventPageDescTitle captionRed small-10 cell">Desc</h1>
                    <div className="small-10 grid-x grid-margin-x align-center-middle cell">
                        {this.state.event.description}
                    </div>
                </div>

                <div
                    id="rightEventSide"
                    className="small-12 medium-8 grid-x align-center-middle cell">
                    <h1 id="rightSideTitle" className="captionRed small-10 cell">Event Info</h1>
                    <Tabs className="small-12 medium-10 cell" tabPosition="right">
                        <TabPane tab="Managers" key="1">
                            <div className="grid-x grid-margin-x align-center-middle cell">
                                <ItemPreview className="small-6 cell" items={this.state.event.managers} type="user"/>
                            </div>
                        </TabPane>
                        <TabPane tab="Attendees" key="2">
                            <div className="grid-x grid-margin-x align-center-middle cell">
                                <ItemPreview className="small-6 cell" items={this.state.event.attendees} type="user"/>
                            </div>
                        </TabPane>
                    </Tabs>
                </div>
            </div>
        )
    }
}

export default EventPage;
