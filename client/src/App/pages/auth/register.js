import React, {Component} from 'react';
import Logo from '../../assets/Logo.svg';
import {register, checkNicknameAvailability, checkEmailAvailability} from '../../util/APIUtils';

import {ValidateFirstName, ValidateLastName, ValidateEmail, ValidateNickname, ValidatePassword, APP_NAME} from '../../util/constants';

import {Link} from 'react-router-dom';
import {Form, Input, Icon, notification} from 'antd';
const FormItem = Form.Item;

class Register extends Component {
    /*
    Constructor for handling Register Object Data
    */
    constructor(props) {
        super(props);
        this.state = {
            firstName: {
                value: ''
            },
            lastName: {
                value: ''
            },
            email: {
                value: ''
            },
            nickname: {
                value: ''
            },
            password: {
                value: ''
            },
            passwordConfirm: {
                value: ''
            }
        }
        //Functions needed for this Register Class
        this.handleInputChange = this
            .handleInputChange
            .bind(this);
        this.handleSubmit = this
            .handleSubmit
            .bind(this);
        this.validateEmailAvailability = this
            .validateEmailAvailability
            .bind(this);
        this.validateNicknameAvailability = this
            .validateNicknameAvailability
            .bind(this);
        this.isFormInvalid = this
            .isFormInvalid
            .bind(this);
    }
    /*
        Handle changes from the form and update our fields
    */
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

    /*
        Handle our submit
    */
    handleSubmit(event) {
        event.preventDefault();
        //save our component values in this const, prepare to send them as POST
        const registerRequest = {
            firstName: this.state.firstName.value,
            lastName: this.state.lastName.value,
            email: this.state.email.value,
            nickname: this.state.nickname.value,
            password: this.state.password.value
        };
        // Clear the values from the component, not needed anymore
        this.setState({
            firstName: {
                value: ''
            },
            lastName: {
                value: ''
            },
            email: {
                value: ''
            },
            nickname: {
                value: ''
            },
            password: {
                value: ''
            }
        });
        // Send the response
        register(registerRequest).then(response => {
            notification.success({
                message: APP_NAME,
                description: "Thank you! You're successfully registered. Please check your email to confirm your registration!"
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
        return !(this.state.firstName.validateStatus === 'success' && 
        this.state.lastName.validateStatus === 'success' && 
        this.state.email.validateStatus === 'success' && 
        this.state.nickname.validateStatus === 'success' && 
        this.state.password.validateStatus === 'success' && 
        this.state.passwordConfirm.validateStatus === 'success');
    }


    /*
    Render the html in the page
    */
    render() {
        return (
            <div className="grid-x align-center-middle">

                {/* Logo */}
                <div className="loginHeader grid-x cell align-center-middle">
                    <img src={Logo} alt="Logo" className="small-10 cell"></img>
                </div>

                {/* Title */}
                <h1 className="caption small-12 cell">Register</h1>

                {/* Form */}
                <Form
                    onSubmit={this.handleSubmit}
                    className="small-12 medium-8 cell grid-x align-center-middle">
                    
                    <FormItem
                        label="First Name"
                        validateStatus={this.state.firstName.validateStatus}
                        help={this.state.firstName.errorMsg}
                        className="medium-3 cell">
                        <Input
                            prefix={< Icon type = "idcard" />}
                            name="firstName"
                            autoComplete="off"
                            placeholder="Enter First Name"
                            value={this.state.firstName.value}
                            onChange={(event) => this.handleInputChange(event, ValidateFirstName)}/>
                    </FormItem>

                    {/* Place Holder DO NOT DELETE */}
                    <div className="medium-2 cell"></div>

                    <FormItem
                        label="Last Name"
                        validateStatus={this.state.lastName.validateStatus}
                        help={this.state.lastName.errorMsg}
                        className="medium-3 cell">
                        <Input
                            prefix={< Icon type = "idcard" />}
                            name="lastName"
                            autoComplete="off"
                            placeholder="Enter Last Name"
                            value={this.state.lastName.value}
                            onChange={(event) => this.handleInputChange(event, ValidateLastName)}/>
                    </FormItem>

                    <FormItem
                        label="Nickname"
                        hasFeedback
                        validateStatus={this.state.nickname.validateStatus}
                        help={this.state.nickname.errorMsg}
                        className="medium-8 cell">
                        <Input
                            prefix={< Icon type = "user" />}
                            name="nickname"
                            autoComplete="off"
                            placeholder="Enter Nickname"
                            value={this.state.nickname.value}
                            onBlur={this.validateNicknameAvailability}
                            onChange={(event) => this.handleInputChange(event, ValidateNickname)}/>
                    </FormItem>

                    <FormItem
                        label="Email"
                        hasFeedback
                        validateStatus={this.state.email.validateStatus}
                        help={this.state.email.errorMsg}
                        className="medium-8 cell">
                        <Input
                            prefix={< Icon type = "mail" />}
                            name="email"
                            type="email"
                            autoComplete="off"
                            placeholder="Enter email"
                            value={this.state.email.value}
                            onBlur={this.validateEmailAvailability}
                            onChange={(event) => this.handleInputChange(event, ValidateEmail)}/>
                    </FormItem>

                    <FormItem
                        label="Password"
                        validateStatus={this.state.password.validateStatus}
                        help={this.state.password.errorMsg}
                        className="medium-8 cell">
                        <Input.Password
                            prefix={< Icon type = "lock" />}
                            name="password"
                            type="password"
                            autoComplete="off"
                            placeholder="Enter Password"
                            value={this.state.password.value}
                            onChange={(event) => this.handleInputChange(event, ValidatePassword)}/>
                    </FormItem>

                    <FormItem
                        label="Confirm Password"
                        validateStatus={this.state.passwordConfirm.validateStatus}
                        help={this.state.passwordConfirm.errorMsg}
                        className="medium-8 cell">
                        <Input.Password
                            prefix={< Icon type = "lock" />}
                            name="passwordConfirm"
                            type="password"
                            autoComplete="off"
                            placeholder="Confirm your password"
                            value={this.state.passwordConfirm.value}
                            onChange={(event) => this.handleInputChange(event, this.validatePasswordConfirm)}/>
                    </FormItem>

                    <FormItem className="cell">
                        <button type="submit" id="registerButton" disabled={this.isFormInvalid()} className="button">
                            Register
                        </button>
                    </FormItem>

                    <Link to="/login" className="link medium-3 cell">Already Registered?</Link>
                </Form>

            </div>
        );
    }

    validatePasswordConfirm = (passwordConfirm) => {
        const passwordValue = this.state.password.value;
        if (passwordConfirm !== passwordValue) {
            return {validateStatus: 'error', errorMsg: `Passwords do not match`}
        } else {
            return ValidatePassword(passwordConfirm)
        }
    }

    // Backend Validation Functions

    validateNicknameAvailability() {
        // First check for client side errors in nickname
        const nicknameValue = this.state.nickname.value;
        const nicknameValidation = ValidateNickname(nicknameValue);

        if (nicknameValidation.validateStatus === 'error') {
            this.setState({
                nickname: {
                    value: nicknameValue,
                    ...nicknameValidation
                }
            });
            return;
        }

        this.setState({
            nickname: {
                value: nicknameValue,
                validateStatus: 'validating',
                errorMsg: null
            }
        });

        checkNicknameAvailability(nicknameValue).then(response => {
            if (response.available) {
                this.setState({
                    nickname: {
                        value: nicknameValue,
                        validateStatus: 'success',
                        errorMsg: null
                    }
                });
            } else {
                this.setState({
                    nickname: {
                        value: nicknameValue,
                        validateStatus: 'error',
                        errorMsg: 'This nickname is already taken'
                    }
                });
            }
        }).catch(error => {
            // Marking validateStatus as success, Form will be recchecked at server
            this.setState({
                nickname: {
                    value: nicknameValue,
                    validateStatus: 'success',
                    errorMsg: null
                }
            });
        });
    }

    validateEmailAvailability() {
        // First check for client side errors in email
        const emailValue = this.state.email.value;
        const emailValidation = ValidateEmail(emailValue);

        if (emailValidation.validateStatus === 'error') {
            this.setState({
                email: {
                    value: emailValue,
                    ...emailValidation
                }
            });
            return;
        }

        this.setState({
            email: {
                value: emailValue,
                validateStatus: 'validating',
                errorMsg: null
            }
        });

        checkEmailAvailability(emailValue).then(response => {
            if (response.available) {
                this.setState({
                    email: {
                        value: emailValue,
                        validateStatus: 'success',
                        errorMsg: null
                    }
                });
            } else {
                this.setState({
                    email: {
                        value: emailValue,
                        validateStatus: 'error',
                        errorMsg: 'This Email is already registered'
                    }
                });
            }
        }).catch(error => {
            // Marking validateStatus as success, Form will be recchecked at server
            this.setState({
                email: {
                    value: emailValue,
                    validateStatus: 'success',
                    errorMsg: null
                }
            });
        });
    }
}
export default Register;
