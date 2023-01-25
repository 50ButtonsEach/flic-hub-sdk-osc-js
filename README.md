# flic-hub-sdk-osc-js
Open Sound Control client for Flic Hub SDK

# Instructions
Using the http://hubsdk.flic.io, create a new file in your module and name it `osc.js` and paste the contents of the `osc.js` file in this repository.

## Creating a client
```javascript
var oscClient = require("./osc").create(host, port);
```

## Sending messages
```javascript
oscClient.send(messageString, function() {
	console.log("message sent");
});
```

## Message format

The client support OSC strings in the following format:
```
[address] [type value]...
```

For example, to send a messate to the address `test1` with an integer value of `23`, a float value of `12.34`, a boolean value of true and the string `hello`, the message string would look as follows:
```
test1 i 23 f 12.34 b true s hello
```


# Example
```javascript
var oscClient = require("./osc").create("123.123.123.123", 3333);

var buttonManager = require("buttons");

buttonManager.on("buttonDown", function(obj) {
	var button = buttonManager.getButton(obj.bdaddr);
	oscClient.send("Flic s " + button.serialNumber, function() {
		console.log("message sent");
	});
});
```
