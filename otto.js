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
	
	function getDirection(direction) {
		return direction == 'dopředu' ? 'dopredu' : 'dozadu';
	}
	
	function getSide(side) {
		return side == 'doprava' ? 'doprava' : 'doleva';
	}
	
	function getGesture(gesture) {
		switch (gesture) {
			case 'šťastný':
				return 'stastny';
			case 'velmi šťastný':
				return 'vstastny';
			case 'smutný':
				return 'smutny';
			case 'naštvaný':
				return 'nastvany';
			case 'zklamaný':
				return 'zklamany';
			case 'zmatený':
				return 'zmateny';
			case 'zamilovaný':
				return 'zamilovany';
			case 'víťezství':
				return 'vitezstvi';
			case 'spánek':
				return 'spanek';
			case 'podrážďěný':
				return 'podrazdeny';
		}
	}
	
	function getSound(sound) {
		switch (sound) {
			case 'šťastný':
				return 'stastny';
			case 'velmi šťastný':
				return 'vstastny';
			case 'smutný':
				return 'smutny';
			case 'připojený':
				return 'pripojeny';
			case 'odpojený':
				return 'odpojeny';
			case 'překvapený':
				return 'prekvapeny';
			case 'přítulný':
				return 'pritulny';
			case 'ohooh':
				return 'ohooh';
			case 'spánek':
				return 'spanek';
			case 'zmatený':
				return 'zmateny';
			case 'prd':
				return 'prd';
		}
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
	
	ext.go_command = function(direction, callback) {
		sendCommand("jdi-" + getDirection(direction), result => callback());
	};
	
	ext.turn_command = function(side, callback) {
		sendCommand("zatoc-" + getSide(side), result => callback());
	};
	
	ext.bend_command = function(side, callback) {
		sendCommand("nahnise-" + getSide(side), result => callback());
	};
	
	ext.jump_command = function(callback) {
		sendCommand("skoc", result => callback());
    };
	
	ext.shake_command = function(side, callback) {
		sendCommand("zatresnohou-" + getSide(side), result => callback());
	};
	
	ext.moonwalk_command = function(side, callback) {
		sendCommand("moonwalk-" + getSide(side), result => callback());
	};
	
	ext.get_distance = function(callback) {
		var distance = getData("distance", (result, data) => callback(parseInt(data)));
	};
	
	ext.gesture_command = function(gesture, callback) {
		sendCommand("gesto-" + getGesture(gesture), result => callback());
	};
	
	ext.sound_command = function(sound, callback) {
		sendCommand("zvuk-" + getSound(sound), result => callback());
	};

    // Block and block menu descriptions
    var descriptor = {
        blocks: [
            // Block type, block name, function name
            ['w', 'probuď se', 'start_command'],
			['w', 'srovnej se', 'dock_command'],
			['w', 'jdi %m.direction', 'go_command', 'dopředu'],
			['w', 'zatoč %m.side', 'turn_command', 'doprava'],
			['w', 'nahni se %m.side', 'bend_command', 'doprava'],
			['w', 'skoč', 'jump_command'],
			['w', 'zatřes nohou %m.side', 'shake_command', 'doprava'],
			['w', 'moonwalk %m.side', 'moonwalk_command', 'doprava'],
			['R', 'vzdálenost', 'get_distance'],
			['w', 'udělej gesto %m.gesture', 'gesture_command', 'šťastný'],
			['w', 'udělej zvuk %m.sound', 'sound_command', 'šťastný'],
        ],
		menus: {
			direction: ['dopředu', 'dozadu'],
			side: ['doprava', 'doleva'],
			gesture: ['šťastný', 'velmi šťastný', 'smutný', 'naštvaný', 'zklamaný', 'zklamaný', 'zmatený', 'zamilovaný', 'víťezství', 'spánek', 'podrážďěný'],
			sound: ['šťastný', 'velmi šťastný', 'smutný', 'připojený', 'odpojený', 'překvapený', 'přítulný', 'ohooh', 'spánek', 'zmatený', 'prd'],
		},
    };

    // Register the extension
    ScratchExtensions.register('Otto', descriptor, ext);
})({});