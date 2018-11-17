var express = require('express');
var router = express.Router();
var User = require('../models/User');
/* GET listing. */
router.get('/:email', function(req, res, next) {
  var email = req.params.email;
  var payload = {};
  console.log('email on back end', email);
  if (email) {
    User.model.findOne({email: email}, function(err, obj) {
      if (err) {
        return res.status(409).send(err.errors);
      } else {
        console.log('USER MONGO DATA OBJECT', obj);
        payload.user = obj;
        return res.status(200).send(payload);
      }
    });
  } else {
    res.status(400).send(payload);
  }
  //find user in DB using this email
  //return userModel if found
});

module.exports = router;
