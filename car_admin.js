
const Car = require("./car");
console.log(Car);
console.log('starting car administrator');

// Establish connection to MQTT broker
const mqtt = require('mqtt');
var client = mqtt.connect('http://localhost:1883', { clientId: "car_manager" });

// The car_admin listens to the car config change event.
var topic = "car config change";

client.on('connect', function () {
    console.log('MQTT client car manager -> connected flag  ' + client.connected);
    client.subscribe(topic);
    console.log('MQTT client car manager subscribed to ' + topic);
})

client.on('error', function (error) {
    console.log("Can't connect : " + error);
    process.exit(1)
})

// Receiving messages on the topic "car config change". When this event occurs, it creates the car objects
// and passes on the configuration upon the car config change event.
client.on('message', function (topic, message, packet) {
    const config = JSON.parse(message);
    console.log("Event occured -> " + topic + " with following data " + message);

    // TODO: reset previous existing cars first for start/stop use case

    // Create car objects
    const allCars = [];

    for (let i = 0; i <= (config.carAdminConfig.numberOfCars - 1); i++) {
        let location = config.carAdminConfig.carsConfig[i].initialLocation;
        let speed = config.carAdminConfig.carsConfig[i].speed;

        switch (i) {
            case 0: // 1st car next to the left wall
                var minInitialLocation = config.carAdminConfig.wallsLocation.left;
                var maxInitialLocation = config.carAdminConfig.carsConfig[i+1].initialLocation;
                break;
            case (config.carAdminConfig.numberOfCars - 1): // last car before the right wall
                var minInitialLocation = config.carAdminConfig.carsConfig[i-1].initialLocation;
                var maxInitialLocation = config.carAdminConfig.wallsLocation.right;
                break;
            default: // initial limits are initial locations of neighbors
                var minInitialLocation = config.carAdminConfig.carsConfig[i-1].initialLocation;
                var maxInitialLocation = config.carAdminConfig.carsConfig[i+1].initialLocation;
        }

        allCars.push(new Car(i, location, speed, minInitialLocation, maxInitialLocation, config.carAdminConfig.numberOfCars));
        console.log("created car " + i);
    }
});