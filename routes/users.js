var express = require('express');
var router = express.Router();
var User = require('../models/User');
var s3 = require('../services/s3');
var ASQ = require('asynquence');


/* GET users listing. */
router.get('/', function(req, res, next) {
  User.model.find({}, function(err, users) {
    console.log('users', users);
    if (err) {
      return res.status(500).send({error: err});
    } else {
      if (users.length > 0) {
        res.send({users: users});
      } else {
        res.send({users: []});
      }
    }
  });
});

router.get('/:id', function(req, res, next) {
  var payload = {},
      id = req.params.id;

  User.model.findById(id, function(err, obj) {
    if (err) {
      payload.error = err;
      return res.status(400).send(payload);
    } else {
      payload.user = obj;
      return res.status(200).send(payload);
    }
  });

});

router.get('/:id/image', function(req, res, next) {
  var id = req.params.id,
      fileName = req.query.file_name,
      fileType = req.query.file_type.toString(),
      payload = {};

  User.model.findById(id, function(err, userDoc) {
    var key = fileName;
    if (err) {
      payload.error = err;
      return res.status(400).send(payload);
    }
    s3.getSignedUrl(key, fileType).then(function(done, result) {
      res.status(200).send(result);
    }).or(function(err) {
      res.status(400).send(err);
    });
  });

});

router.get('/users/deleteS3Object', function(req, res) {
  var id = req.query.id,
      key = req.query.fileName,
      prefix = 'user-files/',
      payload = {};

  s3.deleteObject(key, id, prefix).then(function(done, result) {
    res.status(200).send(payload);
    done();
  }).or(function(err) {
    res.status(400).send(err);
  });
});

router.post('/', function(req, res, next) {
  var payload = {},
      email = req.body.email,
      model = {
        username: '',
        email: email,
        description: ''
      };

  User.model.create(model, function(err, user) {
    if (err) {
      console.log('err', err);
      payload.error = err;
      res.status(400).send(payload);
    } else {
      payload.user = user;
      res.status(200).send(payload);
    }
  });
});

router.put('/:id', function(req, res, next) {
  var userId = req.params.id,
      username = req.body.username,
      description = req.body.description,
      pictureUrl = req.body.pictureUrl,
      email = req.body.email,
      payload = {};

  User.model.findByIdAndUpdate(userId, {$set: {username: username, description: description, email: email , pictureUrl: pictureUrl}}, function(err, user) {
    if (err) {
      console.log('err', err);
      payload.error = err;
      res.status(400).send(payload);
    } else {
      console.log('%j', Object);
      payload.user = user;
      res.status(200).send(payload);
    }
  });
});

module.exports = router;
