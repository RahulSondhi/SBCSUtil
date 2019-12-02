import React, {Component} from 'react';
import {BrowserRouter , Route, Switch, Redirect} from 'react-router-dom'

// Authentification Imports
import Login from '../pages/auth/login.js';
import Logout from '../pages/auth/logout.js';
import Register from '../pages/auth/register.js';
import Forgot from '../pages/auth/forgot.js';
import Verify from '../pages/auth/verify.js'

// Public Page Imports
import OrganizationPage from '../pages/publicPages/organizationPage.js';
import EventPage from '../pages/publicPages/eventPage.js';
import UserPage from '../pages/publicPages/userPage.js';

// User Page Imports
import UsersDisplaysPage from '../pages/userPages/userDisplayPage.js';
import ConfigEventPage from '../pages/userPages/configEventPage.js'
import ConfigOrganizationPage from '../pages/userPages/configOrganizationPage.js';
import SearchPage from '../pages/userPages/searchPage.js';
import ConfigUserPage from '../pages/userPages/configUserPage.js';
import ChangePasswordPage from '../pages/userPages/changePasswordPage.js';
import ErrorPage from '../pages/userPages/errorPage.js';

 
class Routes extends Component {

    constructor(props) {
        super(props);

        this.state = {
            currentUser: this.props.state.currentUser,
            isAuthenticated: this.props.state.isAuthenticated
        };
    }

    render() {
        console.log("Children Authenticated: " + this.state.isAuthenticated);
        if (this.state.currentUser) 
            console.log("User: " + this.state.currentUser.name);
        return (
            <BrowserRouter>
                <Switch>

                    {/* Public */}
                    <PublicRoute
                        exact
                        path={["/", "/login"]}
                        authed={this.state.isAuthenticated}
                        redirectTo="/app/"
                        component=
                        { (props) => <Login onLogin={this.props.onLogin} {...props}/> }/>
                    <PublicRoute
                        exact
                        path="/forgot"
                        authed={this.state.isAuthenticated}
                        redirectTo="/app/"
                        component={Forgot}/>
                    <PublicRoute
                        exact
                        path="/confirm"
                        authed={this.state.isAuthenticated}
                        redirectTo="/app/"
                        component={(props) => <Verify flow={"verifyConfirm"} {...props}/>}/>
                    <PublicRoute
                        exact
                        path="/reset"
                        authed={this.state.isAuthenticated}
                        redirectTo="/app/"
                        component={(props) => <Verify flow={"verifyReset"} {...props}/>}/>
                    <PublicRoute
                        exact
                        path="/register"
                        authed={this.state.isAuthenticated}
                        redirectTo="/app/"
                        component={Register}/>
                    <Route
                        exact
                        path="/newEmail"
                        component={(props) => <Verify flow={"verifyNewEmail"} onLogout={this.props.onLogout} {...props}/>}/> 
                        
                        
                    {/* Private  */}

                    <PrivateRoute
                        exact
                        path={["/app/","/app/search"]}
                        authed={this.state.isAuthenticated}
                        redirectTo="/"
                        component={(props) => <SearchPage currentUser={this.state.currentUser} {...props}/>}/>
                    
                    {/* Events */}
                    <PrivateRoute
                        exact
                        path="/app/createEvent"
                        authed={this.state.isAuthenticated}
                        redirectTo="/"
                        component={(props) => <ConfigEventPage
                        isCreating={true}
                        currentUser={this.state.currentUser}
                        {...props}/>}/>
                    <PrivateRoute
                        exact
                        path="/app/myEvents"
                        authed={this.state.isAuthenticated}
                        redirectTo="/"
                        component={(props) => <UsersDisplaysPage type="event" currentUser={this.state.currentUser} {...props}/>}/>
                    <PrivateRoute
                        exact
                        path="/app/event/:id/config"
                        authed={this.state.isAuthenticated}
                        redirectTo="/"
                        component={(props) => <ConfigEventPage
                        isCreating={false}
                        currentUser={this.state.currentUser}
                        {...props}/>}/>
                    <PrivateRoute
                        exact
                        path="/app/event/:id"
                        authed={this.state.isAuthenticated}
                        redirectTo="/"
                        component={(props) => <EventPage currentUser={this.state.currentUser} {...props}/>}/>
                    
                    
                    {/* Organizations */}
                    <PrivateRoute
                        exact
                        path="/app/createOrganization"
                        authed={this.state.isAuthenticated}
                        redirectTo="/"
                        component={(props) => <ConfigOrganizationPage
                            isCreating={true}
                            currentUser={this.state.currentUser}
                            {...props}/>}/>
                    <PrivateRoute
                        exact
                        path="/app/myOrganizations"
                        authed={this.state.isAuthenticated}
                        redirectTo="/"
                        component={(props) => <UsersDisplaysPage
                        type="organization"
                        currentUser={this.state.currentUser}
                        {...props}/>}/>
                    <PrivateRoute
                        exact
                        path="/app/organization/:id/config"
                        authed={this.state.isAuthenticated}
                        redirectTo="/"
                        component={(props) => <ConfigOrganizationPage
                            isCreating={false}
                            currentUser={this.state.currentUser}
                            {...props}/>}/>
                    <PrivateRoute
                        exact
                        path="/app/organization/:id"
                        authed={this.state.isAuthenticated}
                        redirectTo="/"
                        component={(props) => <OrganizationPage currentUser={this.state.currentUser} {...props}/>}/>
                    

                    {/* User */}
                    <PrivateRoute
                        exact
                        path="/app/user/:id/config"
                        authed={this.state.isAuthenticated}
                        redirectTo="/"
                        component={(props) => <ConfigUserPage currentUser={this.state.currentUser} {...props}/>}/>
                    <PrivateRoute
                        exact
                        path="/app/user/stg/changePassword"
                        authed={this.state.isAuthenticated}
                        redirectTo="/"
                        component={(props) => <ChangePasswordPage currentUser={this.state.currentUser} {...props}/>}/>
                    <PrivateRoute
                        exact
                        path={["/app/user/:id"]}
                        authed={this.state.isAuthenticated}
                        redirectTo="/"
                        component={(props) => <UserPage currentUser={this.state.currentUser} {...props}/>}/>

                    {/* Logout */}
                    <Route
                        path="/logout"
                        component={(props) => <Logout onLogout={this.props.onLogout} {...props}/>}/>
                    <Route path="/tipsy/error" component={ErrorPage}/>
                
                </Switch>
            </BrowserRouter>
        );
    }
}

export default Routes;

const PrivateRoute = ({
    component,
    authed,
    redirectTo,
    ...rest
}) => {
    return (
        <Route
            {...rest}
            render={props => {
            return authed
                ? (renderMergedProps(component, props, rest))
                : (<Redirect
                    to={{
                    pathname: redirectTo,
                    state: {
                        from: props.location
                    }
                }}/>);
        }}/>
    );
};

const PublicRoute = ({
    component,
    authed,
    redirectTo,
    ...rest
}) => {
    return (
        <Route
            {...rest}
            render={routeProps => {
            return authed
                ? (<Redirect
                    to={{
                    pathname: redirectTo,
                    state: {
                        from: routeProps.location
                    }
                }}/>)
                : (renderMergedProps(component, routeProps, rest));
        }}/>
    );
};

const renderMergedProps = (component, ...rest) => {
    const theProps = Object.assign({}, ...rest);
    return React.createElement(component, theProps);
};