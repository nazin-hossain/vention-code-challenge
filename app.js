const express = require('express')
const mqtt = require('mqtt');

console.log("starting app");

// Get Initial car configuration
const carConfigJSON = require('./car_config.json');
console.log(carConfigJSON);
console.log("Number of cars + " + carConfigJSON.carAdminConfig.numberOfCars);

const positions = {}

setTimeout(function () { // <----- on receive message
  positions.car1 = 2000; // <------ change the psoitons object value to the latest car position
}, 10000)


// MQTT client behaviour
// Establish connection to MQTT broker.
var client = mqtt.connect('http://localhost:1883', { clientId: "App" }, { cleanSession: false });

// Publish "car config change" event and subscribe to "car location" event
client.on('connect', function () {
  console.log('MQTT client App -> connected flag  ' + client.connected);
  client.publish("car config change", JSON.stringify(carConfigJSON)); //should send the json config object

  // Subscribe to all the car locations 

  client.subscribe("car position");
  console.log('MQTT client App subscribed to car position');

})

client.on('error', function (error) {
  console.log("Can't connect" + error);
  process.exit(1)
})

// Receiving messages on the topic "car location".

client.on('message', function (topic, message, packet) {
    const data = JSON.parse(message);
    console.log("Event occured -> " + topic + " with following data " + message);

    // <------ position = { "car 1": 2000, "car 2": 404553 }

    positions["car " + data.identity] = data.position;

    // <------ position = { "car 1": 2000, "car 2": 404553 }

});

// web server

const app = express()
const port = 3000

app.use(express.static('public'))

app.get('/car_positions', (req, res) => {
  res.json(positions)
})

app.get('/', (req, res) => {
  res.send(`<!DOCTYPE html>
  <html>
    <head>
      <title>Page Title</title>
      <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
      <script src="browser.js"></script>
      <style>
        body { color: blue; }
        #test {
          position: absolute;
          top: 10px;
          left: 100px;
        }
      </style>
    </head>
    <body>
      <h1>My First Heading</h1>
      <p>My first paragraph.</p>
    </body>
  </html>`)
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

