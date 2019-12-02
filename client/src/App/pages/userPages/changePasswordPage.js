import React, {Component} from 'react';
import Navbar from '../navbar/navbar.js';

import { changePassword } from '../../util/APIUtils';

import { ValidatePassword, APP_NAME } from '../../util/constants'

import { Form, Input, notification, Icon } from 'antd';
const FormItem = Form.Item;

class ChangePasswordPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            password: {
                value: ''
            },
            passwordConfirm: {
                value: ''
            }
        }
        //Functions needed for this Reset Class
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.isFormInvalid = this.isFormInvalid.bind(this);
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

    /*
        Handle our submit 
    */
    handleSubmit(event) {
        event.preventDefault();
    
        const changePasswordRequest = {
            password: this.state.password.value
        };
        changePassword(changePasswordRequest)
        .then(response => {
            notification.success({
                message: APP_NAME,
                description: "Thank you! We have changed your password.",
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
    
    render() {
            return (
                    <div className="grid-x align-center-middle">
                        <Navbar/>
                        <h1 className="caption align-center-middle cell">
                            Change Your Password
                        </h1>
                        <h3>Please enter and confirm your new password.</h3>
                        <Form
                            onSubmit={this.handleSubmit}
                            className="small-12 medium-8 cell grid-x align-center-middle">
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
                                <button type="submit" id="changePasswordButton" disabled={this.isFormInvalid()} onClick={this.disableButton} className="button">
                                    Change Password
                                </button>
                            </FormItem>
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

}

export default ChangePasswordPage;