(function(ext) {
	var url = 'http://localhost:12345/';
	var deviceConnected = false;
	var serviceAvailable = false;
	var timestamp = 0;
	
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
		xhr.addEventListener("error", () => errorCallback());
		xhr.timeout = 3000;
		xhr.send();
	}
	
    // Cleanup function when the extension is unloaded
    ext._shutdown = function() {};

    // Status reporting code
    // Use this to report missing hardware, plugin or unsupported browser
    ext._getStatus = function() {		
		var ts = (Date.now() / 1000) | 0;
		if (timestamp + 3 < ts)	{
			timestamp = ts;
			getData("connection", (result, data) => { 
				deviceConnected = result && data == "True";
				serviceAvailable = true;
			}, () => { 
				deviceConnected = false;
				serviceAvailable = false;
			});
		}		
		if (!serviceAvailable) return {status: 0, msg: 'Service not available'};
        return deviceConnected ? {status: 2, msg: 'Ready'} : {status: 1, msg: 'Device not available'};
    };

    ext.start_command = function(callback) {
		sendCommand("probudse", result => callback());
    };
	
	ext.dock_command = function(callback) {
		sendCommand("srovnejse", result => callback());
    };
	
	ext.go_command = function(direction) {
		
	};

    // Block and block menu descriptions
    var descriptor = {
        blocks: [
            // Block type, block name, function name
            ['w', 'probuď se', 'start_command'],
			['w', 'srovnej se', 'dock_command'],
			['w', 'jdi %m.direction', 'go_command', 'dopředu'],			
        ],
		menus: {
        motorDirection: ['dopředu', 'dozadu'],
    },
    };

    // Register the extension
    ScratchExtensions.register('Otto', descriptor, ext);
})({});