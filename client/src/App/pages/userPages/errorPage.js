import React from 'react';
import Logo from '../../assets/Logo.svg';
import {Link} from 'react-router-dom';
import brokenGlass from '../../assets/errorPage/broken_glass.svg';
import brokenLink from '../../assets/errorPage/broken_link.svg';

const ErrorPage = (props) => {
    const errorType = props.location.state.serverError
        ? <h1 className="caption">
                Server Error
            </h1>
        : <h1 className="caption">
            404 not found
        </h1>;

    const errorImg = props.location.state.serverError
        ? <img src={brokenGlass} alt="BrokenGlassLogo"/>
        : <img src={brokenLink} alt="BrokenLinkLogo"/>;

    const errorDescription = props.location.state.serverError
        ? <h3 className="errorCaption">
                Tipsy was unable to handle this request. Please try again later.
            </h3>
        : <h3 className="errorCaption">
            The page you are looking for is corrupted or does not exist.
        </h3>

    return (
        <div className="grid-y align-center-middle">

            <div className="loginHeader grid-x cell align-center-middle">
                <img src={Logo} alt="Logo" className="small-12 cell"></img>
            </div>

            {errorType}
            {errorImg}
            {errorDescription}
            <Link to='/app/' className="button">
                Home Page</Link>
        </div>
    )
}

export default ErrorPage;