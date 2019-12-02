
const FIRSTNAME_MIN_LENGTH = 2;
const FIRSTNAME_MAX_LENGTH = 50;

const LASTNAME_MIN_LENGTH = 2;
const LASTNAME_MAX_LENGTH = 50;

const EMAIL_MAX_LENGTH = 62;

const NICKNAME_MIN_LENGTH = 4;
const NICKNAME_MAX_LENGTH = 32;

const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 256;

const NAME_MIN_LENGTH = 4;
const NAME_MAX_LENGTH = 32;

const DESC_MAX_LENGTH = 256;

// User

export const validateFirstName = (firstName) => {
    if (firstName.length < FIRSTNAME_MIN_LENGTH) {
        return {validateStatus: 'error', errorMsg: `First name is too short (Minimum ${FIRSTNAME_MIN_LENGTH} characters needed.)`}
    } else if (firstName.length > FIRSTNAME_MAX_LENGTH) {
        return {validationStatus: 'error', errorMsg: `First name is too long (Maximum ${FIRSTNAME_MAX_LENGTH} characters allowed.)`}
    } else {
        return {validateStatus: 'success', errorMsg: null};
    }
}

export const validateLastName = (lastName) => {
    if (lastName.length < LASTNAME_MIN_LENGTH) {
        return {validateStatus: 'error', errorMsg: `Last name is too short (Minimum ${LASTNAME_MIN_LENGTH} characters needed.)`}
    } else if (lastName.length > LASTNAME_MAX_LENGTH) {
        return {validationStatus: 'error', errorMsg: `Last name is too long (Maximum ${LASTNAME_MAX_LENGTH} characters allowed.)`}
    } else {
        return {validateStatus: 'success', errorMsg: null};
    }
}

export const validateEmail = (email) => {
    if (!email) {
        return {validateStatus: 'error', errorMsg: 'Email may not be empty'}
    }

    const EMAIL_REGEX = RegExp('[^@ ]+@[^@ ]+\\.[^@ ]+');
    if (!EMAIL_REGEX.test(email)) {
        return {validateStatus: 'error', errorMsg: 'Email not valid'}
    }

    if (email.length > EMAIL_MAX_LENGTH) {
        return {validateStatus: 'error', errorMsg: `Email is too long (Maximum ${EMAIL_MAX_LENGTH} characters allowed)`}
    }

    return {validateStatus: null, errorMsg: null}
}

export const validateNickname = (nickname) => {
    if (nickname.length < NICKNAME_MIN_LENGTH) {
        return {validateStatus: 'error', errorMsg: `Nickname is too short (Minimum ${NICKNAME_MIN_LENGTH} characters needed.)`}
    } else if (nickname.length > NICKNAME_MAX_LENGTH) {
        return {validationStatus: 'error', errorMsg: `Nickname is too long (Maximum ${NICKNAME_MAX_LENGTH} characters allowed.)`}
    } else {
        return {validateStatus: null, errorMsg: null}
    }
}

export const validatePassword = (password) => {
    if (password.length < PASSWORD_MIN_LENGTH) {
        return {validateStatus: 'error', errorMsg: `Password is too short (Minimum ${PASSWORD_MIN_LENGTH} characters needed.)`}
    } else if (password.length > PASSWORD_MAX_LENGTH) {
        return {validationStatus: 'error', errorMsg: `Password is too long (Maximum ${PASSWORD_MAX_LENGTH} characters allowed.)`}
    } else {
        return {validateStatus: 'success', errorMsg: null};
    }
}

// Events

export const validateName = (name) => {
    if (name.length < NAME_MIN_LENGTH) {
        return {validateStatus: 'error', errorMsg: `Name is too short (Minimum ${NAME_MIN_LENGTH} characters needed.)`}
    } else if (name.length > NAME_MAX_LENGTH) {
        return {validationStatus: 'error', errorMsg: `Name is too long (Maximum ${NAME_MAX_LENGTH} characters allowed.)`}
    } else {
        return {validateStatus: 'success', errorMsg: null};
    }
}

export const validateDesc = (description) => {
    if (description.length > DESC_MAX_LENGTH) {
        return {validationStatus: 'error', errorMsg: `Description is too long (Maximum ${DESC_MAX_LENGTH} characters allowed.)`}
    } else {
        return {validateStatus: 'success', errorMsg: null};
    }
}




