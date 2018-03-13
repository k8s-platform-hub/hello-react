var express = require('express');
var router = express.Router();
var request = require('request');

router.route("/").get(function (req, res) {
  res.send("Hello-React")
});

module.exports = router;
