
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
    

    // TODO: destroy previous existing cars first

    // Create car objects

    const allCars = [];
    // TODO: should be based on config object received in message
    for (let i = 1; i <= config.carAdminConfig.numberOfCars; i++) {
        allCars.push(new Car(i));
        console.log("created car " + i);
    }
});