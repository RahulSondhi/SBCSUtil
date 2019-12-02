import React, {Component} from 'react';
import {Redirect} from 'react-router-dom'
import Navbar from '../navbar/navbar.js';
import {createOrganization, getOrganizationProfile, deleteOrganization, changeOrganizationSettings} from '../../util/APIUtils';

import {MakeProfImg, DynamicForm, ValidateDesc, ValidateName, APP_NAME} from '../../util/constants';

import {Form, Input, Icon, Tabs, notification} from 'antd';

const FormItem = Form.Item;
const {TabPane} = Tabs;

class ConfigBarPage extends Component {

    constructor(props) {
        super(props);
        //Initialize values for all fields

        this.state = {
            isLoading: true,
            isCreating: this.props.isCreating,
            organization: null,
            page: {
                title: "Create an Org",
                submit: "Create an Org"
            },
            name: {
                value: ''
            },
            description: {
                value: ''
            },
            activeMembers: {
                value: []
            },
            members: {
                value: []
            },
            events: {
                value: []
            },
            img: {
                value: ''
            },
            deleteClass: "hidden"
        }
        //Functions needed for this Settings Class
        this.handleInputChange = this
            .handleInputChange
            .bind(this);
        this.handleSubmit = this
            .handleSubmit
            .bind(this);
        
        this.handleDelete = this
            .handleDelete
            .bind(this);

        this.isFormInvalid = this
            .isFormInvalid
            .bind(this);
        this.handleImageLoad = this
            .handleImageLoad
            .bind(this);
        this.loadOrganizationProfile = this
            .loadOrganizationProfile
            .bind(this);
        this.handleListLoad = this
            .handleListLoad
            .bind(this);
    }

    componentDidMount() {

        if (this.state.isCreating === false) {
            let try_name = this.props.match.params.id;
            const id = try_name;
            this.loadOrganizationProfile(id);
        } else {
            this.handleListLoad();
            this.setState({isLoading: false});
        }

    }

    loadOrganizationProfile(id) {
        this.setState({isLoading: true});

        getOrganizationProfile(id).then(response => {

            const tempTitle = "Editing " + response.name;

            this.setState({
                organization: response,
                isLoading: false,
                isDeleting: false,
                page: {
                    title: tempTitle,
                    submit: "Save Organization"
                },
                name: {
                    value: response.name,
                    validateStatus: 'success'
                },
                description: {
                    value: response.description
                },
                events: {
                    value: response.events
                },
                img: {
                    value: response.img
                },
                deleteClass: " "
            });

            
            this.handleListLoad();

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

        // Checking if time to axe it
        if (this.state.isDeleting) {
            deleteOrganization(this.props.match.params.id);
            return <Redirect
                to={{
                pathname: "/app/myOrganizations",
                state: {
                    from: this.props.location
                }
            }}/>
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

                    <Tabs className="tabsBarForm small-12 medium-10 cell" tabPosition="top">
                        <TabPane tab="Desc" key="1">
                            <div className="grid-x grid-margin-x align-center-middle cell">

                                <MakeProfImg
                                    pic={this.state.img.value}
                                    className="cell"
                                    data={this.handleImageLoad}
                                    type="bar"/>

                                <FormItem
                                    label="Name"
                                    validateStatus={this.state.name.validateStatus}
                                    help={this.state.name.errorMsg}
                                    className="small-12 medium-6 cell">
                                    <Input
                                        prefix={< Icon type = "idcard" />}
                                        name="name"
                                        autoComplete="off"
                                        placeholder="Enter Bar Name"
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
                        <TabPane tab="Events" key="2">
                            <div className="grid-x grid-margin-x align-center-middle cell">

                                <DynamicForm
                                    type="event"
                                    data={this.state.recipesAvailable.value}
                                    onUpdate={this.handleListLoad}
                                    validate={this.validateEventAdd}
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

                    <FormItem className={"small-12 medium-8 cell "+this.state.deleteClass}>
                        <button
                            id="settingsButton"
                            onClick={this.handleDelete}
                            className="button">
                            Delete
                        </button>
                    </FormItem>

                </Form>
            </div>
        )
    }


    handleDelete(){
        this.setState({
            isDeleting: true
        })
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

    handleListLoad = () => {

        var SENDevents = this
            .state
            .events
            .value
            .map(function (el) {
                return el.name;
            });

        this.setState({SENDevents: SENDevents});
    }

    validateEventAdd = (id) => {
        if (this.state.events.value.some(items => items['id'] === id) === false ) {
            return true;
        } else {
            return false;
        }
    }

    handleSubmit(event) {
        event.preventDefault();

        const organizationRequest = {
            name: this.state.name.value,
            description: this.state.description.value,
            img: this.state.img.value,
            events: this.state.SENDevents
        };

        if (this.state.isCreating === true) {
            createOrganization(organizationRequest).then(response => {
                notification.success({message: APP_NAME, description: "Your organization was succesfully created!"});
            }).catch(error => {
                notification.error({
                    message: APP_NAME,
                    description: error.message || 'Sorry! Something went wrong. Please try again!'
                });
            });
        } else {
            changeOrganizationSettings(this.props.match.params.id, organizationRequest).then(response => {
                notification.success({message: APP_NAME, description: "Your organization was succesfully saved!"});
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

export default ConfigBarPage;
