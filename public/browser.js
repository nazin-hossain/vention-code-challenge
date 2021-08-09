setInterval(() => {
    $.get("/car_positions", function (data) {
        $.each(data, function (key, newPosition) {
            const carHtmlElement = $("[id='" + key +"']");

            if (carHtmlElement.length > 0) {
                // update the position
                carHtmlElement.css('left', newPosition + "px");
            } else {
                // create the element
                $("body").append("<div id='" + key + "' style='position: absolute; top: 100px; left: " + newPosition + "px'>🚙</div>")
            }
        });
    })
}, 1000);

// For simplicity use emoji to represent the cars on the screen : 🚙