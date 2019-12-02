import React, {Component} from 'react';
import Logo from '../../assets/Logo.svg';
import {Link} from 'react-router-dom';
import {verifyConfirm, verifyNewEmail, verifyReset, resetPassword} from '../../util/APIUtils';
import {ACCESS_TOKEN, ValidatePassword, APP_NAME} from '../../util/constants';
import {Form, Input, Button, notification} from 'antd';
const FormItem = Form.Item;

class Verify extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            flow: this.props.flow,
            uuid: {
                value: '',
                validateStatus: null
            },
            email: {
                value: ''
            },
            password: {
                value: ''
            },
            passwordConfirm: {
                value: ''
            }
        }
        //Functions needed for this Verify Class
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.isFormInvalid = this.isFormInvalid.bind(this);
        this.handleVerify = this.handleVerify.bind(this);
        
    }

    handleInputChange(event, validationFun) {
        const target = event.target;
        const inputName = target.name;        
        const inputValue = target.value;

        this.setState({
            [inputName] : {
                value: inputValue,
                ...validationFun(inputValue)
            }
        });
    }

    componentWillMount() {

        this.handleVerify();

    }

    /*
        Handle our submit 
    */
    handleSubmit(event) {
        event.preventDefault();
    
        const resetPasswordRequest = {
            uuid : this.state.uuid.value,
            password: this.state.password.value
        };
        resetPassword(resetPasswordRequest).then(response => {
            notification.success({
                message: APP_NAME,
                description: "Thank you! We have reset your password. You may now login.",
            });          
        }).catch(error => {
            notification.error({
                message: APP_NAME,
                description: error.message || 'Sorry! Something went wrong. Please try again!'
            });
        });
    }
    /*
        returns true if the Form is invalid.
    */
    isFormInvalid() {
        return !(
            this.state.password.validateStatus === 'success' &&
            this.state.passwordConfirm.validateStatus === 'success'
        );
    }

    handleVerify() {
        let search = window.location.search;
        let params = new URLSearchParams(search);
        const uuidValue = params.get('token');
        if(this.state.flow === "verifyConfirm"){
            //verifyConfirm
            verifyConfirm(uuidValue).then(response => {
                notification.success({ 
                    message: APP_NAME, 
                    description: response.message
                });
                this.setState({
                    uuid: {
                        validateStatus : 'success'
                    }
                });
            }).catch(error => {
                    notification.error({
                        message: APP_NAME,
                        description : error.message
                    });
                    this.setState({
                        uuid: {
                            validateStatus : 'error'
                        }
                    });
                })
        }
        else if(this.state.flow === "verifyNewEmail"){
            //verifyNewEmail
            // We need to delete their access token
            if(localStorage.getItem(ACCESS_TOKEN)){
                localStorage.removeItem(ACCESS_TOKEN);
            }
            const emailValue = params.get('email');
            console.log(emailValue);
            verifyNewEmail(uuidValue, emailValue).then(response =>{
                notification.success({
                        message: APP_NAME,
                        description : response.message
                    });
                    this.setState({
                        uuid: {
                            validateStatus : 'success'
                        }
                    });
            }).catch(error => {
                notification.error({
                    message: APP_NAME,
                    description : error.message
                });
                this.setState({
                    uuid: {
                        validateStatus : 'error'
                    }
                }); 
            })
        }
        else if(this.state.flow === "verifyReset"){
            //verifyReset
            console.log(uuidValue);
            verifyReset(uuidValue).then(response =>{
                notification.success({ 
                    message: APP_NAME, 
                    description: response.message
                });
                this.setState({
                    uuid: {
                        value: uuidValue,
                        validateStatus : 'success'
                    }
                });
            }).catch(error => {
                    notification.error({
                        message: APP_NAME,
                        description : error.message
                    });
                    this.setState({
                        uuid: {
                            value: uuidValue,
                            validateStatus : 'error'
                        }
                    });
                });
        }

        this.setState({
            isLoading: false
        });

    }

    render() {
        // Checking if data came in
        if (this.state.isLoading) {
            return null
        }

        if (this.state.uuid.validateStatus === "success") {
            if(this.state.flow === "verifyReset"){
                return ( //The token is valid, return the form to proceed with password reset
                    <div>
                        <h1>Reset Password</h1>
                        <h3>Please enter a new password to login.</h3>
                        <Form onSubmit={this.handleSubmit} className="">
                            <FormItem 
                                label="Password"
                                validateStatus={this.state.password.validateStatus}
                                help={this.state.password.errorMsg}>
                                <Input 
                                    name="password" 
                                    type="password"
                                    autoComplete="off"
                                    placeholder="Enter Password" 
                                    value={this.state.password.value} 
                                    onChange={(event) => this.handleInputChange(event, ValidatePassword)} />    
                            </FormItem>
                            <FormItem 
                                label="Confirm Password"
                                validateStatus={this.state.passwordConfirm.validateStatus}
                                help={this.state.passwordConfirm.errorMsg}>
                                <Input 
                                    name="passwordConfirm" 
                                    type="password"
                                    autoComplete="off"
                                    placeholder="Confirm your password" 
                                    value={this.state.passwordConfirm.value} 
                                    onChange={(event) => this.handleInputChange(event, this.validatePasswordConfirm)} />    
                            </FormItem>
                            <FormItem>
                                <Button type="primary" 
                                    htmlType="submit" 
                                    disabled={this.isFormInvalid()}>Reset 
                                </Button>
                            </FormItem>
                        </Form>
                    </div>
                );
            }
            else {
                return (
                    <div className="grid-x align-center-middle">

                    {/* Logo */}
                    <div className="loginHeader grid-x cell align-center-middle">
                        <img src={Logo} alt="Logo" className="small-12 cell"></img>
                    </div>

                    {/* Title */}
                <h1 className="caption small-12 medium-8 cell">{"Welcome to"+APP_NAME+"!"}</h1>

                    {/* Description */}
                    <h4 id="forgotDesc" className="small-8 cell">
                        You have successfully registered your account!
                        <br></br>
                        <br></br>
                        Login to your account to start!
                    </h4>

                    <Link to="/login" className="cell">
                        <button type="submit" className="button">Login</button>
                    </Link>

                </div>
                )
            }
        } else {
            return (
                <div className="grid-x align-center-middle">

                    {/* Logo */}
                    <div className="loginHeader grid-x cell align-center-middle">
                        <img src={Logo} alt="Logo" className="small-12 cell"></img>
                    </div>

                    {/* Title */}
                    <h1 className="captionRed small-12 medium-8 cell">Invalid Token</h1>
                </div>
            );
        }
    }

    validatePasswordConfirm = (passwordConfirm) => {
        const passwordValue = this.state.password.value;
        if (passwordConfirm !== passwordValue) {
            return {validateStatus: 'error', errorMsg: `Passwords do not match`}
        } else {
            return ValidatePassword(passwordConfirm)
        }
    }

}
export default Verify;