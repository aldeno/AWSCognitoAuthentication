
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
    $('.response').text("A confirmation email has been sent to the following address: " + email)
  });
}

function signin()
{
  var username = $('#loginUsername').val();
  var password = $('#logiPassword').val();

  var obj = {
    username: username,
    password, password
  };

  $.post('/api/signin', obj, function(data){
    if(data.error){
      $('.response').text("Unable to login...Please check username and password and try again.");
    }
    else {
      localStorage.setItem("token", data.token);
      $("#tabTest").show();
      $('#tabTest a').tab('show');
      $("#tabSignup, #tabLogin").hide();
    }
  });
}

function signout(){
  var token = localStorage.getItem('token');
  $.ajax({
    url: '/api-secure/signout',
    type: 'POST',
    headers: {
      Authorization: token,
    },
    success: function(data){
      $('.response').text("You have been logged out successfully.");
      localStorage.removeItem('token');
    },
  })
  $("#tabSignup, #tabLogin").show();
  $("#tabTest").hide();
  $('#tabLogin a').tab('show');
}


function testRequest(){
  var token = localStorage.getItem('token');
  $.ajax({
    url: '/api-secure/test-request',
    type: 'POST',
    headers: {
      Authorization: token,
    },
    success: function(data){
      $('.response').text(data.message);
    },
  });
}
