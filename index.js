var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');

var testmodule = require('./modules/testmodule.js');
var awsSignupMpodule = require('./modules/awssignup.js');

var app = express();

var dummyData = [];

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use('/static', express.static(path.join(__dirname, '/static')))

//app.use(testmodule);
/*app.get('/api/test-module', function(req, res, next) {
  testmodule.testFunction();
  res.status(200).send('');
});*/

app.post('/api/signup', function(req, res){
  console.log('Entering /api/signup');

  var username = req.body.username;
  var password = req.body.password;
  var email = req.body.email;

  var username = awsSignupMpodule.signup('testuser', 'testpassword', 'testmail@mail.com');
  console.log(username);
  username.then(function(user){
    res.status('200').send({emai: email});
  }, function(err) {
    res.status(200).send({error: err});
  });
});

/*app.get('/api/sign-up', function(req, res){
  console.log('Entering /api/test-module...');
  var username = awsSignupMpodule.signup('testuser', 'testpassword', 'testmail@mail.com');
  console.log(username);
  username.then(function(user){
    res.status('200').send('A new username is: ' + user);
  });
});*/

//testmodule.testFunction();

app.get('/', function(req, res){
  res.sendFile(path.join(__dirname + '/index.html'));
});

/*app.get('/api/get-data', function(req, res){
  res.json({data: dummyData});
});*/

/*app.post('/api/post-data', function(req, res) {
  var newData = req.body.data;
  dummyData.push(newData);
  res.json({data: dummyData});
});*/

app.listen(8080, function(){
  console.log('server is up');
});
