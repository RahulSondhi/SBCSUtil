const mongoose = require('mongoose');
const User = require('../../models/users');

const connUri = process.env.MONGO_LOCAL_CONN_URL;

module.exports = {
  register: (req, res) => {
    mongoose.connect(connUri, { useNewUrlParser : true }, (err) => {
      let result = {};
      let status = 201;
      if (!err) {
        const {firstName, lastName, email, nickname, password} = req.body;
        // const firstName = req.body.firstName;
        // const lastName = req.body.lastName;
        // const email = req.body.email;
        // const nickname = req.body.nickname;
        // const password = req.body.password;

        let user = new User();
        user.firstName = firstName;
        user.lastName = lastName;
        user.email = email;
        user.nickname = nickname;
        user.password = password;
        user.roles = ["USER"];
        user.save((err, user) => {
          if (!err) {
            result.status = status;
            result.result = user;
          } else {
            status = 500;
            result.status = status;
            result.error = err;
          }
          res.status(status).send(result);
        });
      } else {
        status = 500;
        result.status = status;
        result.error = err;
        res.status(status).send(result);
      }
    });
  }
}