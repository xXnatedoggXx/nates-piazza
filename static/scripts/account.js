$(document).ready(function () {

  $.ajaxSetup({
    beforeSend: function(xhr) {
        xhr.setRequestHeader('Authenticated', 'Bearer ' + window.localStorage.getItem('token'));
    }
  });

  $('#login').click(function() {
    var username = $('#enter-username').val();
    var password = $('#enter-password').val();

    $.ajax({
        url: '/account/login',
        data: { username: username, password: password },
        type: "GET",
        success: function(res) {
          if(res.success) {
            window.localStorage.setItem('token', res.token);
            window.location.href = '/home';
          } else {
            var errormes = "<div id=\"error-message\">" + res.status + "</div>";
            if(!$('#error-message').length) {
              $("body").append(errormes);
            }          
          }
        },
      });
  });
});
