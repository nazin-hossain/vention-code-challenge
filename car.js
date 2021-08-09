const mqtt = require('mqtt');

// Construction of the car object identified as 'car 1', 'car 2' etc. 

function Car(id, location, speed, minLocation, maxLocation) {
    console.log("Car id:", id);

    this.startListening = function () {
        console.log("Car " + id + " is driving"); //what does this do?
    }

    // MQTT client behaviour

    // Establish connection to MQTT broker. Note: should disconnect if already connected from before (update config use case)

    var clientIdentity = "car " + id;
    var client = mqtt.connect('http://localhost:1883', { clientId: clientIdentity }, { cleanSession: false });
    var moveForward = true; // TODO: randomize

    client.on('connect', function () {
        console.log('MQTT client App -> connected flag  ' + client.connected);

        // Publish car location every 1 sec. Note that speed in pixels/s implies that the
        // car position changes by the value of the speed
        setInterval(function () {
            // The car moves in one direction until it bumps into the next car or the wall. When it bumps into the
            // neighbor or the wall, it changes direction and continues it's motion.
            if (moveForward) {
                if ((location + speed) < maxLocation) {
                    location = location + speed;
                }else {
                    moveForward = !moveForward;
                    location = location - speed;
                };
            } else {
                if ((location - speed) > minLocation) {
                    location = location - speed;
                }else {
                    moveForward = !moveForward;
                    location = location + speed;
                };
            };
            
            let msg = { 
                identity: id,
                position: location
            };
            // client.publish("car " + id, JSON.stringify(msg)); Alternative to consider
            client.publish("car position", JSON.stringify(msg));
            console.log("publishing ", msg);

            console.log('MQTT Client car published the location of car ' + msg.identity + msg.position);
        }, 1000);
    })

    client.on('error', function (error) {
        console.log("Can't connect" + error);
        process.exit(1)
    })

}

module.exports = Car;
