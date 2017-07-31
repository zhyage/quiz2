var express = require('express');
var router = express.Router();

/* GET users listing. */
router.post('/users', function(req, res, next) {
  //res.send('respond with a resource');
  console.info("get request from client");
  console.info(req.body);
  console.info(JSON.parse(req.body));
  res.json([{
    id: 1,
    username: "samsepi0l"
  }, {
    id: 2,
    username: "D0loresH4ze"
  }]);
});

module.exports = router;
