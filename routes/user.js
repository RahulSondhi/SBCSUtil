const userController = require('../controllers/app/UserController');

module.exports = (router) => {
  router.route('/app/user/currentUser')
    .get(userController.getCurrentUser);

};