const loginController = require('../controllers/authentication/LoginController');
const registerController = require('../controllers/authentication/RegisterController');
const validateToken = require('../utils').validateToken;

module.exports = (router) => {
  router.route('/login')
    .post(loginController.login);

  router.route('/register')
    .post(registerController.register);
};