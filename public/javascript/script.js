var invalid_msg_duration = 30000;

var main = function () {

  $('.btn.btn-info').click(function () {
    var num = $(this).attr('value');
    $("#box").val(function () {
      var prev = $("#box").val();
      var newNum = prev + num;
      if (newNum.length > 8)
      {
        return prev;
      }
      else
      {
        return newNum;
      }
      return prev;
    });
  });

  $('#bksps').click(function() {
    $("#box").val(function () {
      var prev = $("#box").val();
      var oldLen = prev.length;
      return prev.slice(0, oldLen-1);
    });
  });
};

// Reloads the page after 30 seconds
function reload_invalid_page(){
  setTimeout(function(){
    window.location.href = "/checkin";
  }, invalid_msg_duration);
}

$(document).ready(main);
