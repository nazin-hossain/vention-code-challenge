const express = require('express')
const mqtt = require('mqtt');

console.log("starting app");

// Get configuration for all cars
const carConfigJSON = require('./car_config.json');
console.log(carConfigJSON);
console.log("Number of cars + " + carConfigJSON.carAdminConfig.numberOfCars);

const positions = {}

/*
setTimeout(function () { // <----- on receive message
  positions.car1 = 2000; // <------ change the psoitons object value to the latest car position
}, 10000)
*/

// MQTT client behaviour

// Establish connection to MQTT broker
var client = mqtt.connect('http://localhost:1883', { clientId: "App" }, { cleanSession: false });

client.on('connect', function () {
  console.log('MQTT client App -> connected flag  ' + client.connected);

  // Publish "car config change" event
  client.publish("car config change", JSON.stringify(carConfigJSON));

  // Subscribe to "car position" event that will enable App server to get notification
  // of all car position changes 
  client.subscribe("car position");
  console.log('MQTT client App subscribed to all car position changes');
})

client.on('error', function (error) {
  console.log("Can't connect" + error);
  process.exit(1)
})

// Receiving messages on car position updates
client.on('message', function (topic, message, packet) {
    const data = JSON.parse(message);
    console.log("Event occured -> " + topic + " with following data " + message);

    positions["car " + data.identity] = data.position;
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
      
    </body>
  </html>`)
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

