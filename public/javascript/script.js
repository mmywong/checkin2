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

$(document).ready(main);
