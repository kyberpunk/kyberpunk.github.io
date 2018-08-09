(function(ext) {
    // Cleanup function when the extension is unloaded
    ext._shutdown = function() {};

    // Status reporting code
    // Use this to report missing hardware, plugin or unsupported browser
    ext._getStatus = function() {
        return {status: 2, msg: 'Ready'};
    };

    ext.start = function(callback) {
		var xhr = new XMLHttpRequest();
		request.onload = function () {
			var status = request.status;
			var data = request.responseText;
			callback();
		}
		xhr.open("POST", "http://localhost:12345/start");
		xhr.send();
        // Code that gets executed when the block is run
    };

    // Block and block menu descriptions
    var descriptor = {
        blocks: [
            // Block type, block name, function name
            ['w', 'probuď se', 'start'],
        ]
    };

    // Register the extension
    ScratchExtensions.register('My first extension', descriptor, ext);
})({});