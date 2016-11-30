var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
var request = require("request");
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Home' });
});


// signin
router.get('/signin', function(req, res, next) {
  res.render('signin', { title: 'Sign In' });
});

app.post("/action",function(req, res){
    var first_name = req.body.firstName;
    var last_name = req.body.lastName;
    var email = req.body.email;
    var login = req.body.email;
    var password = req.body.password;
    var security_question = req.body.securityQuestion;
    var answer = req.body.answer;
   
var formdata = req.body;
var options = { method: 'POST',
  url: 'https://forest.okta.com/api/v1/users',
  body:{
    "profile": {
      "firstName": formdata.firstName,
      "lastName": formdata.lastName,
      "email": formdata.email,
      "login": formdata.email
    },
    "credentials": {
      "password" : { "value": formdata.password },
      "recovery_question": {
        "question": formdata.securityQuestion,
        "answer": formdata.answer
      }
    }
  },
  qs: { activate: 'false' },
  headers: 
   { 'postman-token': 'b66dbe75-6590-d541-6930-b7fe44524c57',
     'cache-control': 'no-cache',
     authorization: 'SSWS 00Xa5X9HjCcctwhj47zX0GMuX4edvxuQByjy4aO3UW',
     'content-type': 'application/json',
     accept: 'application/json' } };

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  console.log(body);
});


});
// Registration

router.get('/registration', function(req, res, next) {



  res.render('registration', { title: 'Registration' });
});


// Applications
router.get('/applications', function(req, res, next) {
  var options = { 
    method: 'GET',
    url: 'https://forest.okta.com/api/v1/users/me/appLinks',
    headers: 
        { 
          'cache-control': 'no-cache',
           authorization: 'SSWS 00BkztJXBuZRC4N8-MGHCHo4KW_AYEsXNg2SPEXTWx',
          'content-type': 'application/json',
           accept: 'application/json' 
        } 
 };

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  console.log(body);

  var apps = JSON.parse(body)
    res.render('applications', { title: 'Applications', apps: apps });
  });
});







module.exports = router;


