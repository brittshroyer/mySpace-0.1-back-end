var express = require('express');
var router = express.Router();
var User = require('../models/User');
/* GET listing. */
router.get('/:email', function(req, res, next) {
  var email = req.params.email;
  var payload = {};
  console.log('email', email);
  User.model.findOne({email: email}, function(err, obj) {
    console.log('obj', obj);
    if (err) {
      return res.status(404).send(err.errors);
    } else if (!obj) {
      payload.user = {
        email: '',
        description: '',
        _id: '',
        username: ''
      };
      return res.status(206).send(payload);
    } else {
      payload.user = obj;

      console.log('obj on backend low', obj);
      return res.status(200).send(payload);
    }

    console.log('obj', obj);
  });

  //find user in DB using this email
  //return userModel if found
});

module.exports = router;
