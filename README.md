# flic-hub-sdk-osc-js
Open Sound Control client for Flic Hub SDK

# Instructions
1. Using the Flic app, connect to the Flic Hub and make sure "SDK Access" is enabled under Settings and the the hub is online
2. Go to http://hubsdk.flic.io and connect to your Flic Hub
3. Create a new module
4. Right click the newly created module and select "New file", name the file `osc.js`
5. Copy the contents of `osc.js` in this repository and paste in the `osc.js` file in the Flic Hub SDK
6. (Optional) Open `main.js` in the Flic Hub SDK and paste the following example:

# Example
This example sends an OSC message to the path `flic` with the button serial number each time a Flic is pushed.

```javascript
var oscClient = require("./osc").create("123.123.123.123", 3333);

var buttonManager = require("buttons");

buttonManager.on("buttonDown", function(obj) {
	var button = buttonManager.getButton(obj.bdaddr);
	oscClient.send("flic s " + button.serialNumber, function() {
		console.log("message sent");
	});
});
```


create a new file in your module and name it `osc.js` and paste the contents of the `osc.js` file in this repository.

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
[path] [[type] [value]]...
```

For example, to send a messate to the path `test1` with an integer value of `23`, a float value of `12.34`, a boolean value of `true` and the string `hello`, the message string would look as follows:
```
test1 i 23 f 12.34 b true s hello
```

In javascript it would look like this:
```javascript
oscClient.send("test1 i 23 f 12.34 b true s hello", function() {});
```
