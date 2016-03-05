$(document).ready(function () {
    $("table").on("click", "tbody", function () {
        var $this = $(this);
        var myTRs = $this.children("tr");

        if ($this.hasClass("collapsed")) {
            $this.removeClass("collapsed");
            myTRs.first().remove();
            myTRs.show();
        } else {
            $this.addClass("collapsed");
            var newInfo = myTRs.first().children("td").first().text();
            myTRs.hide();
            $this.prepend($("<tr><td colspan='1'>" + newInfo + "</td></tr>").hide()).find("tr").first().slideDown();
        }
    });
});