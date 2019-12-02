const mongoose = require('mongoose');
const User = require('../../models/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const connUri = process.env.MONGO_LOCAL_CONN_URL;

module.exports = {
  getCurrentUser: (req, res) => {
    mongoose.connect(connUri, { useNewUrlParser: true }, (err) => {
      let result = {};
      let status = 200;
      //TODO: get the token from the request, get email, then check signature, then return user
      let token = req.header('Authorization');
    
      if (!err) {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) =>{
        if(!err){
          const email = decoded.user;
          User.findOne({email}, (err, user) => {
            if (!err) {
              result.status = status;
              result.error = err;
              var userSummary = {
                id: user.id,
                email: user.email,
                nickname: user.nickname,
                roles: user.roles
              };
              result.result = userSummary;
            } else {
              status = 500;
              result.status = status;
              result.error = err;
            }
            res.status(status).send(result);
          });
        } else {
          status = 401;
          result.status = status;
          result.error = `Authentication error`;
          res.status(status).send(result);
        }
        })
        } else {
          status = 500;
          result.status = status;
          result.error = err;
          res.status(status).send(result);
        }
    });
  },  
  // getAll: (req, res) => {
  //   mongoose.connect(connUri, { useNewUrlParser: true }, (err) => {
  //     let result = {};
  //     let status = 200;
  //     if (!err) {
  //       const payload = req.decoded;
  //       // TODO: Log the payload here to verify that it's the same payload
  //       //  we used when we created the token
  //       // console.log('PAYLOAD', payload);
  //       if (payload && payload.user === 'admin') {
  //         User.find({}, (err, users) => {
  //           if (!err) {
  //             result.status = status;
  //             result.error = err;
  //             result.result = users;
  //           } else {
  //             status = 500;
  //             result.status = status;
  //             result.error = err;
  //           }
  //           res.status(status).send(result);
  //         });
  //       } else {
  //         status = 401;
  //         result.status = status;
  //         result.error = `Authentication error`;
  //         res.status(status).send(result);
  //       }
  //     } else {
  //       status = 500;
  //       result.status = status;
  //       result.error = err;
  //       res.status(status).send(result);
  //     }
  //   });
  // }
}