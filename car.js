const mqtt = require('mqtt');

// Construction of the car object identified as 'car 0', 'car 1', 'car 2' etc. 

function Car(id, location, speed, leftLocationLimit, rightLocationLimit, numberOfCars) {
    console.log('Car id:', id);

    // MQTT client behaviour

    // Establish connection to MQTT broker
    // Note: TODO should disconnect if already connected from before (update config use case)

    var clientIdentity = "car " + id;
    var client = mqtt.connect('http://localhost:1883', { clientId: clientIdentity }, { cleanSession: false });

    // Randomize direction - Forward is going right to left to match car image facing left
    var moveForward = Math.random() < 0.5;

    client.on('connect', function () {
        console.log('MQTT client App -> connected flag  ' + client.connected);

        // Subscribe to "car position" event that will enable App server to get notification
        // of all car position changes 
        client.subscribe("car position");
        console.log('MQTT client Car subscribed to all car position changes'); // TODO: consider listening to only neighbors

        // Publish car location every 1 sec. 
        setInterval(function () {

            // The car moves in one direction until it bumps into the next car or the wall. When it bumps into the
            // neighbor or the wall, it changes direction and continues it's motion.

            // Note that speed in pixels/s implies that the
            // car position changes by the value of the speed which is configured to be in pixels
            if (moveForward) {

                // Direction is forward (right to left)
                if ((location - speed) > leftLocationLimit) {
                    // move left if there is room
                    location = location - speed;
                } else {
                    // if there is no room to move left then change direction and move
                    moveForward = !moveForward;
                    if ((location + speed) < rightLocationLimit) {location = location + speed};
                };
            } else {
                // Direction is reverse (left to right)
                if ((location + speed) < rightLocationLimit) {
                    // move right if there is room
                    location = location + speed;
                } else {
                    // if there is no room to move right then change direction and move
                    moveForward = !moveForward;
                    if ((location - speed) > leftLocationLimit) {location = location - speed};
                };
            };

            let msg = {
                identity: id,
                position: location
            };

            client.publish("car position", JSON.stringify(msg));
            console.log("publishing ", msg);

            console.log('MQTT Client car published the location of car ' + msg.identity + msg.position);
        }, 1000); //This function loops every second to ensure movement speed is in pixels/s
    })

    client.on('error', function (error) {
        console.log("Can't connect" + error);
        process.exit(1)
    })

    // Receiving messages on car position updates
    client.on('message', function (topic, message, packet) {
        const data = JSON.parse(message);
        console.log("Event occured -> " + topic + " with following data " + message);

        switch (id) {
            case 0: // 1st car next to the left wall
                if (!moveForward) {
                    // Motion direction is towards right
                    if (data.identity == (id + 1)) {
                        rightLocationLimit = data.position;
                    };
                };
                break;
            case (numberOfCars - 1): // last car before the right wall
                if (moveForward) {
                    // Motion direction is towards left
                    if (data.identity == (id - 1)) {
                        leftLocationLimit = data.position;
                    };
                };
                break;
            default: //in between two cars
                if (!moveForward) {
                    // Motion direction is towards right
                    if (data.identity == (id + 1)) {
                        rightLocationLimit = data.position;
                    };
                } else {
                    // Motion direction is towards left
                    if (data.identity == (id - 1)) {
                        leftLocationLimit = data.position;
                    };
                };
        }
    });
}
// In order for car_admin.js to create car objects
module.exports = Car;
