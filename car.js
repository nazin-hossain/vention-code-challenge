const mqtt = require('mqtt');

// Construction of the car object identified as 'car 1', 'car 2' etc. 

function Car(id) {
    console.log("Car id:", id);

    this.startListening = function () {
        console.log("Car " + id + " is driving"); //what does this do?
    }
    // MQTT client behaviour

    // Establish connection to MQTT broker. Note: should disconnect if already connected from before (update config use case)

    var clientIdentity = "car " + id;
    var client = mqtt.connect('http://localhost:1883', { clientId: clientIdentity }, { cleanSession: false });
    let cnt = 0;
    var speed = 5; // pixels/s
    var location = 100; // pixel location on x-axis
    let direction = 1; // set to right

    client.on('connect', function () {
        console.log('MQTT client App -> connected flag  ' + client.connected);
        //    client.publish("car command", "test message"); //using default options
        //publish every 1 sec
        setInterval(function () {
            let msg = { 
                identity: id,
                position: location
            };
            // client.publish("car " + id, JSON.stringify(msg));
            client.publish("car position", JSON.stringify(msg));
            console.log("publishing ", msg);
            location = location + speed;
            console.log('MQTT Client car published the location of car ' + msg.identity + msg.position);
            cnt += 1;
        }, 1000);
    })

    client.on('error', function (error) {
        console.log("Can't connect" + error);
        process.exit(1)
    })

}



module.exports = Car;
