import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './App/App';
import * as serviceWorker from './serviceWorker';

import './foundation/foundation.min.css';
import './index.css';
import './App/css/constant.css';
import './App/css/form.css';
import './App/css/auth.css';
import './App/css/navbar.css';
import './App/css/userPages.css';
import './App/css/publicPages.css';

render((
    <BrowserRouter>
        <App/>
    </BrowserRouter>
), document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
