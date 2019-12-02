import { ACCESS_TOKEN, API_BASE_URL } from './constants'

const request = (options) => {
    const headers = new Headers({
        'Content-Type': 'application/json',
    })
    
    if(localStorage.getItem(ACCESS_TOKEN)) {
        headers.append('Authorization', localStorage.getItem(ACCESS_TOKEN))    
        // headers.append('Authorization', 'Bearer ' + localStorage.getItem(ACCESS_TOKEN))

    }

    const defaults = {headers: headers};
    options = Object.assign({}, defaults, options);

    return fetch(options.url, options)
    .then(response => 
        response.json().then(json => {
            if(!response.ok) {
                return Promise.reject(json);
            }
            return json;
        })
    );
};


export function login(loginRequest) {
    return request({
        url: API_BASE_URL + "/api/login",
        method: 'POST',
        body: JSON.stringify(loginRequest)
    });
}

export function register(registerRequest) {
    return request({
        url: API_BASE_URL + "/api/register",
        method: 'POST',
        body: JSON.stringify(registerRequest)
    });
}

export function forgot(forgotRequest) {
    return request({
        url: API_BASE_URL + "/forgot",
        method: 'POST',
        body: JSON.stringify(forgotRequest)
    });
}

export function resetPassword(resetPasswordRequest) {
    return request({
        url: API_BASE_URL + "/resetPassword",
        method: 'POST',
        body: JSON.stringify(resetPasswordRequest)
    });
}

export function verifyReset(uuid) {
    return request({
        url: API_BASE_URL + "/verifyReset?token=" + uuid,
        method: 'GET'
    });
}

export function verifyConfirm(uuid) {
    return request({
        url: API_BASE_URL + "/verifyConfirm?token=" + uuid,
        method: 'GET'
    });
}

export function verifyNewEmail(uuid, email) {
    return request({
        url: API_BASE_URL + "/app/user/verifyNewEmail?token=" + uuid + "&email=" + email,
        method: 'GET'
    });
}

export function checkNicknameAvailability(nickname) {
    return request({
        url: API_BASE_URL + "/app/user/checkNicknameAvailability?nickname=" + nickname,
        method: 'GET'
    });
}

export function checkEmailAvailability(email) {
    return request({
        url: API_BASE_URL + "/app/user/checkEmailAvailability?email=" + email,
        method: 'GET'
    });
}

export function getCurrentUser() {
    if(!localStorage.getItem(ACCESS_TOKEN)) {
        return Promise.reject("No access token set.");
    }

    return request({url: API_BASE_URL + "/api/app/user/currentUser", method: 'GET'
    });
}

export function getEventProfile(eventID) {
    return request({
        url: API_BASE_URL + "/app/event/" + eventID,
        method: 'GET'
    });
}

export function createEvent(eventRequest) {
    return request({
        url: API_BASE_URL + "/app/event/createEvent",
        method: 'POST',
        body: JSON.stringify(eventRequest)
    });
}

export function changeEventSettings(eventID, eventRequest) {
    return request({
        url: API_BASE_URL + "/app/event/" + eventID + "/changeSettings" ,
        method: 'POST',
        body: JSON.stringify(eventRequest)
    });
}

export function deleteEvent(eventID) {
    return request({
        url: API_BASE_URL + "/app/event/" + eventID + "/delete" ,
        method: 'POST',
        body: JSON.stringify(null)
    });
}

export function getUserProfile(nickname) {
    return request({
        url: API_BASE_URL + "/app/user/" + nickname,
        method: 'GET'
    });
}

export function getUserSettings(nickname) {
    return request({
        url: API_BASE_URL + "/app/user/" + nickname + "/getSettings",
        method: 'GET',
    });
}

export function changeUserSettings(settingsRequest,nickname) {
    return request({
        url: API_BASE_URL + "/app/user/"+nickname+"/changeSettings",
        method: 'POST',
        body: JSON.stringify(settingsRequest)
    });
}

export function changePassword(changePasswordRequest) {
    return request({
        url: API_BASE_URL + "/app/user/changePassword",
        method: 'POST',
        body: JSON.stringify(changePasswordRequest)
    });
}

export function getOrganizationProfile(organizationID) {
    return request({
        url: API_BASE_URL + "/app/organization/" + organizationID,
        method: 'GET'
    });
}

export function createOrganization(organizationRequest) {
    return request({
        url: API_BASE_URL + "/app/organization/createOrganization",
        method: 'POST',
        body: JSON.stringify(organizationRequest)
    });
}

export function changeOrganizationSettings(organizationID, organizationRequest) {
    return request({
        url: API_BASE_URL + "/app/organization/" + organizationID + "/changeSettings" ,
        method: 'POST',
        body: JSON.stringify(organizationRequest)
    });
}

export function deleteOrganization(organizationID) {
    return request({
        url: API_BASE_URL + "/app/organization/" + organizationID + "/delete" ,
        method: 'POST',
        body: JSON.stringify(null)
    });
}

export function search(type, query) {
    return request({
        url: API_BASE_URL + "/app/search?type=" + type + "&query=" + query,
        method: 'GET'
    });
}

export function getUserBrief(nickname) {
    return request({
        url: API_BASE_URL + "/app/search/user/getBrief?nickname=" + nickname,
        method: 'GET'
    });
}

export function getEventBrief(eventID) {
    return request({
        url: API_BASE_URL + "/app/search/event/getBrief?eventID=" + eventID,
        method: 'GET'
    });
}

export function getOrganizationBrief(organizationID) {
    return request({
        url: API_BASE_URL + "/app/search/organization/getBrief?organizationID=" + organizationID,
        method: 'GET'
    });
}
