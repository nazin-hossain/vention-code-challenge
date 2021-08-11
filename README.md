# vention-code-challenge
Code challenge for Vention.io in August 2021 for Nazin Hossain

### Getting started

1. Download this project (clone this git repo) on the local machine

2. If not already installed in the local machine, install Node.js

3. Install the packages

```
     $ npm install
```

4. Launch the application

```
     $ npm start
```

### Configuration

In this very basic version, to change the configurable start locations and speeds of the cars, modify the car_config.json file before running the application. Note that array of cars in the car_config.json file MUST be listed from left to right, and MUST be in between the virtual wall locations.

### Description of this project

In this project, simplistic autonomous car objects (in NodeJS env) move along a 1D axis (towards left or right) at configurable speeds (in pixels per second). While running, each car process broadcasts its position an inter-process communication channel, implemented using MQTT (with a private MQTT message broker running in the localhost).

Each of the car instances, run in its own NodeJS process, each configured to start at a distinct position, with a distinct speed and randomized direction: towards left or towards right.  During configuration, each car instance knows who its immediate neighbors are.  When a car bumps into one of its neighbours, or into a virtual wall at either end of the runway, it automatically changes direction. Note that the initial ordering of cars always remain the same.
 
In the back-end, there is one NodeJS server, App.js that collects all car advertisements, and displays the cars continuously in a very simple UI. This is implemented as a web stack by the App.js Nodejs server. It provides data access routes (via API created using Express) to the UI on a browser running in http://localhost:3000/.

### High level architecture
![VentionCodeChallenge - Architecture](https://user-images.githubusercontent.com/48063785/128818756-ce15604e-3830-4b9d-b593-ef6d2eaf1cc6.jpeg)
### About Implementation Decisions

The implementation decisions taken were based on fulfilling the spirit of the challenge requirements while taking short cuts in the interest of time on certain things that may not be as important to demonstrate in the challenge. This section highlights some of the implement decisions and the rationale.

![Vention take home coding challenge - Google Docs](https://user-images.githubusercontent.com/48063785/128825950-f4a7a934-c3f2-44b0-81e2-6a2255cb6d0a.jpeg)

- NodeJS: One of the key aspects of this challenge is to get a feel for implementation aspects of distributed agents (i.e. the simple "cars") constantly moving and communicating with each other and to a central server, simple dynamically changing data. The choice of the back-end server was NodeJS, since it's ideal for handling real time applications and heavy data flow, specially when it requires minimal cpu processing for each event. Note that the "car" agent software was also built on NodeJS for consistency, and a lack of a relevant reason to choose an alternative (for the purpose of this exercise).
- MQTT: Chosen as the messaging protocol since it would likely be the ideal lightweight protocol choice in a real world IoT scenario. Since this project needed a very simple private MQTT server that can be run on the local host, Aedes was chosen to implement the MQTT broker.
- ExpressJS was used as the web application framework for ease of use. The basic UI requirement was very bare and simplistic for the scope of the challenge, and was implemented with barebone HTML, with the browser using an API end point provided by App.js (created using ExpressJS).

### Testing Approach

The application was primarily manually tested by checking the console logs displayed at the terminal as well as the web browser, generated at all the key moments. The intention has been to provide automated testing using Jest (a Javascript testing framework), which is why the package loads the Jest module, however the current version does not include automated testing.  



