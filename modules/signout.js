var AmazonCognitoIdentity = require('amazon-cognito-identity-js');
var CognitoUserPool = AmazonCognitoIdentity.CognitoUserPool;
var conf = require('../configuration.js');
var jwt = require('jsonwebtoken');

module.exports.signout = function(req, res) {

  var token = req.body.token || req.query.token || req.headers['authorization'];
  var decodedJwt = jwt.decode(token, {
    complete: true
  });
  var username = decodedJwt.payload['cognito:username'];

  var poolData = {
    UserPoolId: conf.USER_POOL_ID,
    ClientId: conf.CLIENT_ID,
  };
  var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
  var userData = {
    Username: username,
    Pool: userPool
  };
  var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

  cognitoUser.signOut();

  res.json({
    signout: true,
    error: false
  });
}
