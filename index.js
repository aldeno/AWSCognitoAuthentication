var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');

var testmodule = require('./modules/testmodule.js');
var awsSignupMpodule = require('./modules/awssignup.js');
var awsAuth = require('./modules/signin.js');
var signout = require('./modules/signout.js');
var authenticate = require('./modules/authenticate');

var app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

//Serve static files from /static folder (js, css)
app.use('/static', express.static(path.join(__dirname, '/static')));

//Create a new user on AWS
app.post('/api/signup', function(req, res) {
  var username = req.body.username;
  var password = req.body.password;
  var email = req.body.email;

  var username = awsSignupMpodule.signup(username, password, email);
  username.then(function(user) {
    res.status('200').send({
      emai: email
    });
  }, function(err) {
    res.status(200).send({
      error: err
    });
  });
});

//Authenticate user on AWS
app.post('/api/signin', awsAuth.signin);

//signout user from AWS
app.post('/api-secure/signout', function(req, res) {
  signout.signout(req, res);
});

app.all('/api-secure/*', function(req, res, next){
  authenticate.authenticate(req, res, next);
});

app.post('/api-secure/test-request', function(req, res) {
  res.json({message: 'You are authenticated.'});
});

//return main html page
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/index.html'));
});

//Listen on localhost:8080
app.listen(8080, function() {
  console.log('server is up');
});
