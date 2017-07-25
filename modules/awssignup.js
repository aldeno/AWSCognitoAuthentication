var AmazonCognitoIdentity = require('amazon-cognito-identity-js');
var CognitoUserPool = AmazonCognitoIdentity.CognitoUserPool;

module.exports.signup = function(username, mail, password){
  var poolData = {
        UserPoolId : 'eu-central-1_kMoL2C28M', // Your user pool id here
        ClientId : '59hinj2b96f5sr62t2g0clf5b' // Your client id here
    };

    var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

    var attributeList = [];

    var dataEmail = {
        Name : 'email',
        Value : 'email@mydomain.com'
    };

    var attributeEmail = new AmazonCognitoIdentity.CognitoUserAttribute(dataEmail);
    attributeList.push(attributeEmail);

    var username = 'user2' + Math.floor(Math.random() *10000000);

    return new Promise((resolve, reject) => (userPool.signUp(username, 'password', attributeList, null, function(err, result){
        if (err) {
            reject(err);
            return;
        }
        var cognitoUser = result.user;
        resolve(cognitoUser);
    })));
}
