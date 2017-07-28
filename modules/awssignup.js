var AmazonCognitoIdentity = require('amazon-cognito-identity-js');
var CognitoUserPool = AmazonCognitoIdentity.CognitoUserPool;

var conf = require('../configuration.js');

module.exports.signup = function(username, password, mail) {
  var poolData = {
    UserPoolId: conf.USER_POOL_ID,
    ClientId: conf.CLIENT_ID,
  };

  var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

  var attributeList = [];

  var dataEmail = {
    Name: 'email',
    Value: mail,
  };

  var attributeEmail = new AmazonCognitoIdentity.CognitoUserAttribute(dataEmail);
  attributeList.push(attributeEmail);


  return new Promise((resolve, reject) => (userPool.signUp(username, password, attributeList, null, function(err, result) {
    if (err) {
      reject(err);
      return;
    }
    var cognitoUser = result.user;
    resolve(cognitoUser);
  })));
}
