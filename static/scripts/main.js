$(document).ready(function () {

  var data = [];
  var activeIdx = -1;

  // kick off getting the posts
  getPosts();
  // now do it  every 2.5 seconds
  setInterval(getPosts, 2500);

  $.ajaxSetup({
    beforeSend: function(xhr) {
        xhr.setRequestHeader('Authenticated', 'Bearer ' + window.localStorage.getItem('token'));
    }
  });

  $('#logout').click(function() {
    var username = $('#enter-username').val();
    var password = $('#enter-password').val();

    $.ajax({
        url: '/account/logout',
        data: { username: username, password: password },
        type: "GET",
        beforeSend: function(xhr) {
            xhr.setRequestHeader('Authenticated', 'Bearer ');
        },
        success: function(res) {
          window.localStorage.setItem('token', undefined);
          window.location.href = '/account/logout';
        }
      });
  });

  function getPosts() {
    $.ajax({
        url: '/api/getStatements',
        success: function(res) {
          data = res.statements;
        }
    }).then(
      $.ajax({
        url: '/api/getQuestions',
        success: function(res) {
          data = data.concat(res.questions);
        }
      })
    ).then(
      render()
    )
  };
    // TODO: make an ajax request to /api/getposts. on success
    //       set  the data variable equal to the response and render
    //       out the post previews (by calling renderPreviews())
    //       Later on in the writeup, also render the active post
    //       (to update it) with renderactive()

  // makes a list  of posts which all have the post text and a data-qid attribute
  // that allows you to access their _id by doing $whateverjQueryObjectYouHave.data('qid')
  function render() {
    renderPreviews();
    renderActive();
  }

  function renderPreviews() {
    $('#posts').html(
        data.map((i) => '<li data-pid="' + i._id + '">' + i.text + '</li>').join('')
    )
  }

  function renderActive() {
    if (activeIdx > -1) {
      var active = data[activeIdx];
      $('#show-post').css('display', 'block');

      if(active.exists) {
        $('#post-type').text('Instructor Notification:');
      } else {
        $('#post-type').text(active.authorType + ' question:');
      }

      $('#post').text(active.text ? active.text: '');
      $('#author').text(active.author ? active.author: '');

      $('#answer-text').text(active.answer ? active.answer : '');
    } else {
      $('#show-post').css('display', 'none');
    }
  }

  $('#posts').on('click', 'li', function () {
    var _id = $(this).data('pid');
    for (var i = 0; i < data.length; i++) {
      if(data[i]._id === _id) activeIdx = i;
    }

    renderActive();
  })

  $('#show-post').on('click', '#submitAnswer', function () {
    var answerText = $('#answer').val();

    if(data[activeIdx].exists) {
      $.ajax({
          url: '/api/replyStatement',
          data: { answer: answerText,
                  pid: data[activeIdx]._id },
          type: 'POST',
          success: function(res) {
            $('.modal').css('display', 'none');
          }
      })
    } else {
      $.ajax({
          url: '/api/answerQuestion',
          data: { answer: answerText,
                  pid: data[activeIdx]._id },
          type: 'POST',
          success: function(res) {
            $('.modal').css('display', 'none');
          }
      })
    }

  })

  // when we want to make a new post, show the modal
  $('#new-post').on('click', function () {
    $('.modal').css('display', 'block');
  })

  $('#close').on('click', function () {
    if($('#error-message')) $(".error").remove();
    $('.modal').css('display', 'none');

  })

  $('#submit-question').on('click', function () {
    var text = $('#post-text').val();
    $.ajax({
        url: '/api/addQuestion',
        data: { text: text },
        type: 'POST',
        success: function(res) {
          $('.modal').css('display', 'none');
        }
      })
  })

  $('#submit-statement').on('click', function () {
    var text = $('#post-text').val();
    $.ajax({
        url: '/api/addStatement',
        data: { text: text },
        type: 'POST',
        success: function(res) {
          if(res.success) {
            $('.modal').css('display', 'none');
          } else {
              document.getElementById("submit-modal");
              var errorDiv = document.createElement('div');
              errorDiv.setAttribute('class', 'error');
              errorDiv.setAttribute('id', 'error-message');
              errorDiv.innerHTML = "You can only submit statements as an instructor";
              document.getElementById("submit-modal").appendChild(errorDiv);
          }
        }
      })
  })
})
