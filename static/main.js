
function signup(){
  var username = $('#username').val();
  var password = $('#password').val();
  var email = $('#email').val();
  var obj = {
    username: username,
    password: password,
    email: email
  };

  $.post( "/api/signup", obj, function( data ) {
    $('#response').text("A confirmation email has been sent to the following address: " + email)
  });
}
