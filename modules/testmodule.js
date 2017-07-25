/*module.exports = function(req, res, next){
  console.log("Hello from the testmodule.js");
  res.status(200).send("Hello from the testmodule.js");
  next();
}*/

module.exports.testFunction = function(){
  console.log("Hello from module.exports.testFunction ");
  return "return from module.exports.testFunction!";
  //res.status(200).send("Hello from module.exports.testFunction ");
}
