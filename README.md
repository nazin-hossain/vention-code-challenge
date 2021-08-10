# vention-code-challenge
Code challenge for Vention.io in August 2021 for Nazin Hossain

### Getting started

1. Install the packages

```
npm install
```

2. Run the application

```
npm start
```

### Configuration

In this very basic version, to change the configurable start locations and speeds of the cars, modify the car_config.json file before running the application. Note that array of cars in the car_config.json file MUST be listed from left to right, and MUST be in between the virtual wall locations.

### Description of this project

In this project, simplistic autonomous car objects (in NodeJS env) move along a 1D axis (towards left or right) at configurable speeds (in pixels per second). While running, each car process broadcasts its position an inter-process communication channel, implemented using MQTT (with a private MQTT message broker running in the localhost).

Each of the car instances, run in its own NodeJS process, each configured to start at a distinct position, with a distinct speed (the given speed has randomized orientation: left or right).  During configuration, each car instance knows who its immediate neighbors are.  When a car bumps into one of its neighbours, or into a virtual wall at either end of the runway, it automatically changes direction. Note that he initial ordering of cars always remain the same.
 
In the back-end, there is one NodeJS server, App.js that collects all car advertisements, and displays the five cars continuously in a very simple UI. This would preferably be implemented as a web stack by the App.js nodejs server that is handling all the connections with cars, and providing data access routes (via API created using Express) to the UI on a browser running in http://localhost:3000/.

### High level architecture

![VentionCodeChallenge - Architecture](https://user-images.githubusercontent.com/48063785/128818756-ce15604e-3830-4b9d-b593-ef6d2eaf1cc6.jpeg)
