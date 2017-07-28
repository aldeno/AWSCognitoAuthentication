var AmazonCognitoIdentity = require('amazon-cognito-identity-js');
var CognitoUserPool = AmazonCognitoIdentity.CognitoUserPool;
var request = require('request');
var jwt = require('jsonwebtoken');
var jwkToPem = require('jwk-to-pem');
var conf = require('../configuration.js');

module.exports.authenticate = function(req, res, next){
  var pems;
  //Download the JWKs and save it as PEM
  request({
    url: conf.JSON_WEB_TOKEN_SET,
    json: true
  }, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      pems = {};
      var keys = body['keys'];

      for (var i = 0; i < keys.length; i++) {
        //Convert each key to PEM
        var key_id = keys[i].kid;
        var modulus = keys[i].n;
        var exponent = keys[i].e;
        var key_type = keys[i].kty;
        var jwk = {
          kty: key_type,
          n: modulus,
          e: exponent
        };
        var pem = jwkToPem(jwk);
        pems[key_id] = pem;
      }
      validateToken(req, res, next, pems);
    } else {
      res.json({
        success: false,
        error: "Unable to retrieve PSM"
      });
    }
  });
}

var validateToken = function(req, res, next, pems) {
  var token = req.body.token || req.query.token || req.headers['authorization'];
  var decodedJwt = jwt.decode(token, {
    complete: true
  });

  if(!decodedJwt){
    res.json({
      success: false,
      error: "Invalid token"
    });
    return;
  }

  req.username = decodedJwt.payload['cognito:username'];

  //Reject token if issuer is not the same
  if (decodedJwt.payload.iss != conf.ISS) {
    res.json({
      success: false,
      error: "Unknown issuer"
    });
    return;
  }

  //Reject the jwt if it's not an 'IDToken'
  if (decodedJwt.payload.token_use != 'id') {
    res.json({
      success: false,
      error: "Not an access token."
    });
    return;
  }
  var kid = decodedJwt.header.kid;
  var pem = pems[kid];
  if (!pem) {
    res.json({
      success: false,
      error: "Unable to get kid."
    });
    return;
  }

  jwt.verify(token, pem, {
    issuer: conf.ISS
  }, function(err, payload) {
    if (err) {
      res.json({
        success: false,
        error: err
      });
      return;
    }
    res.setHeader('Authorization', 'Bearer ' + token);
    next();
  });
}
