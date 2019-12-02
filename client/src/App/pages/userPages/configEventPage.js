import React, {Component} from 'react';
import {Redirect} from 'react-router-dom'
import Navbar from '../navbar/navbar.js';
import {createEvent, getEventProfile, changeEventSettings} from '../../util/APIUtils';

import {MakeProfImg, DynamicForm, ValidateName, ValidateDesc, APP_NAME} from '../../util/constants';

import {Form, Input, Icon, Tabs, notification} from 'antd';

const FormItem = Form.Item;
const {TabPane} = Tabs;

class ConfigEventPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            isCreating: this.props.isCreating,
            recipe: null,
            page: {
                title: "Create an Event",
                submit: "Create an Event"
            },
            name: {
                value: ''
            },
            description: {
                value: ''
            },
            attendees: {
                value: []
            },
            managers: {
                value: []
            },
            img: {
                value: ''
            }
        }
        //Functions needed for this Settings Class
        this.handleInputChange = this
            .handleInputChange
            .bind(this);
        this.handleSubmit = this
            .handleSubmit
            .bind(this);
        this.isFormInvalid = this
            .isFormInvalid
            .bind(this);
        this.handleImageLoad = this
            .handleImageLoad
            .bind(this);
        this.loadEventProfile = this
            .loadEventProfile
            .bind(this);
        this.handleListLoad = this
            .handleListLoad
            .bind(this);
    }

    componentDidMount() {

        if (this.state.isCreating === false) {
            let try_name = this.props.match.params.id;
            const id = try_name;
            this.loadEventProfile(id);
        } else {
            this.setState({isLoading: false});
        }

    }

    loadEventProfile(id) {
        this.setState({isLoading: true});

        getEventProfile(id).then(response => {

            const tempTitle = "Editing " + response.name;

            this.setState({
                event: response,
                isLoading: false,
                page: {
                    title: tempTitle,
                    submit: "Save Event"
                },
                name: {
                    value: response.name,
                    validateStatus: 'success'
                },
                description: {
                    value: response.description
                },
                attendees: {
                    value: response.attendees
                },
                managers: {
                    value: response.managers
                },
                img: {
                    value: response.img
                }
            });

        }).catch(error => {
            if (error.status === 404) {
                this.setState({notFound: true, isLoading: false});
            } else {
                this.setState({serverError: true, isLoading: false});
            }
        });
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

                <h1 className="caption align-center-middle cell">
                    {this.state.page.title}
                </h1>

                <Form
                    onSubmit={this.handleSubmit}
                    className="small-12 medium-8 cell grid-x align-center-middle">

                    <Tabs className="tabsRecipeForm small-12 medium-10 cell" tabPosition="top">
                        <TabPane tab="Desc" key="1">
                            <div className="grid-x grid-margin-x align-center-middle cell">

                                <MakeProfImg
                                    pic={this.state.img.value}
                                    className="cell"
                                    data={this.handleImageLoad}
                                    type="recipe"/>

                                <FormItem
                                    label="Name"
                                    validateStatus={this.state.name.validateStatus}
                                    help={this.state.name.errorMsg}
                                    className="small-12 medium-6 cell">
                                    <Input
                                        prefix={< Icon type = "idcard" />}
                                        name="name"
                                        autoComplete="off"
                                        placeholder="Enter Recipe Name"
                                        value={this.state.name.value}
                                        onChange={(event) => this.handleInputChange(event, ValidateName)}/>
                                </FormItem>

                                <div className="cell"></div>

                                <FormItem
                                    label="Description"
                                    validateStatus={this.state.description.validateStatus}
                                    help={this.state.description.errorMsg}
                                    className="small-12 medium-10 cell">
                                    <Input
                                        prefix={< Icon type = "idcard" />}
                                        name="description"
                                        autoComplete="off"
                                        placeholder="Enter a Description"
                                        value={this.state.description.value}
                                        onChange={(event) => this.handleInputChange(event, ValidateDesc)}/>
                                </FormItem>

                            </div>
                        </TabPane>
                        <TabPane tab="Managers" key="2">
                            <div className="grid-x grid-margin-x align-center-middle cell">

                                <DynamicForm
                                    type="user"
                                    data={this.state.managers.value}
                                    onUpdate={this.handleListLoad}
                                    validate={this.validateUserAdd}
                                    className="cell"/>

                            </div>
                        </TabPane>

                        <TabPane tab="Attendees" key="3">
                            <div className="grid-x grid-margin-x align-center-middle cell">

                                <DynamicForm
                                    type="user"
                                    data={this.state.attendees.value}
                                    onUpdate={this.handleListLoad}
                                    validate={this.validateUserAdd}
                                    className="cell"/>

                            </div>
                        </TabPane>
                    </Tabs>

                    <FormItem className="small-12 medium-8 cell">
                        <button
                            type="submit"
                            id="settingsButton"
                            disabled={this.isFormInvalid()}
                            onClick={this.disableButton}
                            className="button">
                            {this.state.page.submit}
                        </button>
                    </FormItem>

                </Form>
            </div>
        )
    }

    handleInputChange(event, validationFun) {
        const target = event.target;
        const inputName = target.name;
        const inputValue = target.value;

        this.setState({
            [inputName]: {
                value: inputValue,
                ...validationFun(inputValue)
            }
        });
    }

    handleImageLoad = (val) => {
        this.setState({
            img: {
                value: val
            }
        });
    }

    validateUserAdd = (name) => {
        var notOwner = true;

        if(this.state.isCreating === false){
            notOwner = (this.state.event.host.name !== name);
        }else{
            notOwner = (this.props.currentUser.name !== name);
        }

        if (this.state.managers.value.some(items => items['name'] === name) === false && this.state.attendees.value.some(items => items['name'] === name) === false && notOwner) {
            return true;
        } else {
            return false;
        }
    }
    handleListLoad = () => {
        var SENDmanagers = this
            .state
            .managers
            .value
            .map(function (el) {
                return el.name;
            });

        var SENDattendees = this
            .state
            .attendees
            .value
            .map(function (el) {
                return el.name;
            });

        
        if(SENDmanagers  === null || SENDmanagers === "" || SENDmanagers === undefined){
            SENDmanagers = [];
        }

        if(SENDattendees  === null || SENDattendees === "" || SENDattendees === undefined){
            SENDattendees = [];
        }

        this.setState({SENDmanagers: SENDmanagers, SENDattendees: SENDattendees});    
    }

    handleSubmit(event) {
        event.preventDefault();

        const eventRequest = {
            name: this.state.name.value,
            description: this.state.description.value,
            img: this.state.img.value,
            managers: this.state.managers.value,
            attendees: this.state.attendees.value
        };

        if (this.state.isCreating === true) {
            createEvent(eventRequest).then(response => {
                notification.success({message: APP_NAME, description: "Your event was succesfully created!"});
            }).catch(error => {
                notification.error({
                    message: APP_NAME,
                    description: error.message || 'Sorry! Something went wrong. Please try again!'
                });
            });
        } else {
            changeEventSettings(this.props.match.params.id, eventRequest).then(response => {
                notification.success({message: APP_NAME, description: "Your event was succesfully saved!"});
            }).catch(error => {
                notification.error({
                    message: APP_NAME,
                    description: error.message || 'Sorry! Something went wrong. Please try again!'
                });
            });
        }
    }

    isFormInvalid() {
        return !(this.state.name.validateStatus === 'success');
    }

}

export default ConfigEventPage;
