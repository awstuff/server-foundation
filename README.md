# server-foundation
A foundation for an Express-powered Node.js server. Not wanting to copy the same boilerplate code for every project, I created this library as a comfortable wrapper around it.

## Installation
`npm install server-foundation`

## Features
`server-foundation` uses Express internally, as already mentioned. Apart from that, the following libraries are used:

- `helmet` for secure HTTP headers
- `compression` for response compression
- `express-content-length-validator` for request length validation
- `body-parser` for request parsing
- `hpp` for HTTP parameter polution prevention

Internal features implemented on top of that:

- Cross site script inclusion (XSSI) prevention

## Usage
The following sample illustrates `server-foundation`'s usage:

```javascript
const server = require("server-foundation");


server.beforeStartup(app => {
	// do something before the app's startup. The parameter app is the Express app object
});


server.afterStartup(() => {
	// do something after the app's startup
});


server.registerRoutes(router => {
	// register the app's routes. The parameter router is the Express router object

	// router.get("/users", ...
});


server.start(8080, "sample-app");	// start the app, available at localhost:8080/sample-app
// alternatively, the second parameter can be omitted to make the app available at the server root.
// if both parameters are omitted, the port set in process.env.PORT, if any, or the default port 8080 is used
```
