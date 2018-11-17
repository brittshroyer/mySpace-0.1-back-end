var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  console.log('hitting users route');
  res.json([
    {id: 1, username: "somebody"},
    {id: 2, username: "somebody_else"}
  ]);
});

router.get('/:email', function(req, res, next) {
  console.log('hitting users/email route!!!!');
});

module.exports = router;
