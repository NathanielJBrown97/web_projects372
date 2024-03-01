$(document).ready(function() {
    // load html 
    $("#loadHtmlBtn").click(function() {
        $(".view-container").load("tempContent.html");
    });

    // load and process JSON data
    $("#loadJsonBtn").click(function() {
        $.getJSON("tempContent.json", function(data) {
            var items = [];
            items.push("<h3>" + data.title + "</h3><p>" + data.description + "</p>");
            $.each(data.links, function(index, link) {
                items.push("<a href='" + link.href + "'>" + link.title + "</a><br>");
            });
            $(".view-container").html(items.join(""));
        });
    });

    // load HTML content with jQuery
    $("#loadJqueryContentBtn").click(function() {
        $.ajax({
            url: "tempJqueryContent.html",
            success: function(result) {
                $(".view-container").html(result);
            }
        });
    });
});
