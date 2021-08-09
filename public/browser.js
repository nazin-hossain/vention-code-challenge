console.log("starting browser");

setInterval(() => {
    $.get("/car_positions", function (data) {
        console.log(data);
    })
}, 1000);


// 🚙