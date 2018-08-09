(function(ext) {
	var url = 'http://localhost:12345/';
	var deviceConnected = false;
	
	function sendCommand(command, callback) {
		var xhr = new XMLHttpRequest();		
		xhr.open("POST", url + "commands/" + command, true);
		xhr.onload = function () {
			var status = xhr.status;
			var data = xhr.responseText;
			callback(status == 201);
		}
		xhr.send();
	}
	
	function getData(resource, callback, errorCallback) {
		var xhr = new XMLHttpRequest();		
		xhr.open("GET", url + resource, true);
		xhr.onload = function () {
			var status = xhr.status;
			var data = xhr.responseText;
			callback(status == 200, data);
		}
		xhr.onerror = () => errorCallback();
		xhr.send();
	}
	
    // Cleanup function when the extension is unloaded
    ext._shutdown = function() {};

    // Status reporting code
    // Use this to report missing hardware, plugin or unsupported browser
    ext._getStatus = function() {
		getData("connection", (result, data) => deviceConnected = result && data == "True", () => deviceConnected = false);
        return deviceConnected ? {status: 2, msg: 'Ready'} : {status: 0, msg: 'Device not available'};
    };

    ext.start_command = function(callback) {
		sendCommand("start", result => callback());
    };
	
	ext.dock_command = function(callback) {
		sendCommand("dock", result => callback());
    };

    // Block and block menu descriptions
    var descriptor = {
        blocks: [
            // Block type, block name, function name
            ['w', 'probuď se', 'start_command'],
			['w', 'srovnej se', 'dock_command'],
        ]
    };

    // Register the extension
    ScratchExtensions.register('Otto', descriptor, ext);
})({});