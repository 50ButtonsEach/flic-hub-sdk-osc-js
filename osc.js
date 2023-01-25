// osc.js

var dgram = require("dgram");

function addStringToArray(arr, str) {
	for (var i = 0; i < str.length; i++) {
		arr.push(str.charCodeAt(i));
	}
}

function alignArray(arr) {
	var mod = arr.length%4;
	var add = mod == 0 ? 0 : 4-mod;
	
	for (var i = 0; i < add; i++) {
		arr.push(0);
	}
}

function toArrayBuffer(buf) {
    var ab = new ArrayBuffer(buf.length);
    var view = new Uint8Array(ab);
    for (var i = 0; i < buf.length; ++i) {
        view[i] = buf[i];
    }
    return ab;
}

function createOSCMessage(messageString) {
	var self = this;
	
	self.messageString = messageString;

	self.getBuffer = function() {
		var messageData = [];
		var valuesData = [];
		var messageComponents = self.messageString.split(" ");
		var address = messageComponents[0];
		
		addStringToArray(messageData, address);
		messageData.push(0);
		alignArray(messageData);
		
		var types = ",";
		
		for (var i = 1; i < messageComponents.length; i += 2) {
			if (messageComponents.count <= i+1) {
				console.log("A type is missing a value");
				break;
			}

			var type = messageComponents[i];
			var valueString = messageComponents[i+1];
			
			if (type == "i") {
				types += type;
				var val = parseInt(valueString);
				valuesData.push((val >>> 24) & 0xFF);
				valuesData.push((val >>> 16) & 0xFF);
				valuesData.push((val >>> 8) & 0xFF);
				valuesData.push(val & 0xFF);
				
			} else if (type == "f") {
				types += type;
				var val = parseFloat(valueString);
				var buff = new Buffer(4);
				buff.writeFloatBE(val);
				for (var j = 0; j < buff.length; ++j) {
        	valuesData.push(buff[j]);
    		}
				
			} else if (type == "s") {
				types += type;
				addStringToArray(valuesData, valueString);

				valuesData.push(0);
				alignArray(valuesData);
			} else if (type == "b") {
				types += valueString == "true" ? "T" : "F";
			} else {
				console.log("Unsupported type: ", type);
				break;
			}
		}
		
		addStringToArray(messageData, types);
		messageData.push(0);
		alignArray(messageData);
		messageData = messageData.concat(valuesData);
		return new Buffer(messageData);
	}
	
	return self;
}

module.exports = {
	"create": function(host, port) {
		var self = {};
		var socket = dgram.createSocket("udp4", function (msg) {});

		self.send = function(messageString, cb) {
			var message = createOSCMessage(messageString);
			socket.send(message.getBuffer(), port, host, cb);
		}

		return self;
	}
};
