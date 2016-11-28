var express = require('express');

var request = require("request");
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Home' });
});

router.get('/signin', function(req, res, next) {
  res.render('signin', { title: 'Sign In' });
});

router.get('/registration', function(req, res, next) {
  res.render('registration', { title: 'Registration' });
});

router.get('/applications', function(req, res, next) {
  var options = { method: 'GET',
  url: 'https://forest.okta.com/api/v1/users/me/appLinks',
  headers: 
   { 'postman-token': '4de78559-5319-522b-476e-656a5ac6ae68',
     'cache-control': 'no-cache',
     authorization: 'SSWS 00Xa5X9HjCcctwhj47zX0GMuX4edvxuQByjy4aO3UW',
     'content-type': 'application/json',
     accept: 'application/json' } };

request(options, function (error, response, apps) {
  if (error) throw new Error(error);

  console.log(apps);
    res.render('applications', { title: 'Applications', apps: apps });
});

});





module.exports = router;
