var AmazonCognitoIdentity = require('amazon-cognito-identity-js');
var CognitoUserPool = AmazonCognitoIdentity.CognitoUserPool;
var request = require('request');
var jwt = require('jsonwebtoken');
var jwkToPem = require('jwk-to-pem');
var conf = require('../configuration.js');

module.exports.signin = function(req, res, next) {
  var authenticationData = {
    Username: req.body.username,
    Password: req.body.password,
  };


  var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);
  var poolData = {
    UserPoolId: conf.USER_POOL_ID,
    ClientId: conf.CLIENT_ID,
  };
  var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
  var userData = {
    Username: req.body.username,
    Pool: userPool
  };
  var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

  cognitoUser.authenticateUser(authenticationDetails, {
    onSuccess: function(result) {
      var token = result.getIdToken().getJwtToken();
      res.json({
        success: true,
        token: token
      });
    },
    onFailure: function(err) {
      res.json({
        success: false,
        error: err
      });
    },
  });
}
