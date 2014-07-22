var onLogin;

// Global error handling
exports.error = function(e) {
	return T('util').alertError( (_.isObject(e) && e.message) ? e.message : e.toString() );
};


// Set the onLogin callback
exports.onLogin = function(callback) {
	if (callback !== undefined) {
		onLogin = callback;
	} else {
		if (_.isFunction(onLogin)) {
			onLogin();
			onLogin = null;
		}
	}
};


// Login onto the Auth System
exports.login = function(callback){
	if (callback!==undefined) exports.onLogin(callback);
	T('flow').openDirect('signup');
};


// Handle the network errors based on HTTP code
exports.handleNetworkError = function(e) {
	if (e.code===401) {
		exports.login();
	} else {
		exports.error(e);
	}
};


// Route system based on URL
exports.route = function(url) {
};


// Start the app (route) + Tishadow
exports.start = function() {
	var initialSchema = T('util').parseSchema();
	if (initialSchema) {
		exports.route(initialSchema);
	} else if (ENV_DEVELOPMENT && Alloy.CFG.tishadow.route) {
		exports.route( Alloy.CFG.tishadow.route );
	}
};