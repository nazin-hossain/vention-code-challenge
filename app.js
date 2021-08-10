const express = require('express')
const mqtt = require('mqtt');

console.log('starting app');

// Get configuration for all cars from car_config.json file
const carConfigJSON = require('./car_config.json');
console.log(carConfigJSON);
console.log('Number of cars + ' + carConfigJSON.carAdminConfig.numberOfCars);

const positions = {} 

// MQTT client behaviour

// Establish connection to MQTT broker
var client = mqtt.connect('http://localhost:1883', { clientId: 'App' }, { cleanSession: false });

client.on('connect', function () {
  console.log('MQTT client App -> connected flag  ' + client.connected);

  // Publish "car config change" MQTT event
  client.publish("car config change", JSON.stringify(carConfigJSON));

  // Subscribe to "car position" MQTT event broadcast by every car. This enables App server 
  // to get notification of all car position changes 
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
    console.log('Event occured -> ' + topic + ' with following data ' + message);

    // collecting car positions to be sent to the web browser
    positions['car ' + data.identity] = data.position;
});

// App NodeJS as the web server

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

      </style>
    </head>
    <body>

    </body>
  </html>`)
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

