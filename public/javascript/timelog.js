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
            var day = myTRs.first().children("td").first().text();
            var hours = myTRs.first().children("td").children("tr");
            console.log(hours);
            myTRs.hide();
            $this.prepend($("<tr><td>" + day + "</td><td></td></td></tr>").hide()).find("tr").first().slideDown();
        }
    });
});