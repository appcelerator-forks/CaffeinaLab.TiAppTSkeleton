var onLogin;

// Global error handling
function error(e) {
	return T('util').alertError( (_.isObject(e) && e.message) ? e.message : e.toString() );
}
exports.error = error;


// Set the onLogin callback
function onLogin(callback) {
	if (callback !== undefined) {
		onLogin = callback;
	} else {
		if (_.isFunction(onLogin)) {
			onLogin();
			onLogin = null;
		}
	}
}
exports.onLogin = onLogin;


// Login onto the Auth System
function login(callback){
	if (callback!==undefined) onLogin(callback);
	T('flow').openDirect('signup');
}
exports.login = login;


// Handle the network errors based on HTTP code
function handleNetworkError(e) {
	if (e.code===401) {
		login();
	} else {
		error(e);
	}
}
exports.handleNetworkError = handleNetworkError;


// Route system based on URL
function route(url) {
}
exports.route  = route;


// Start the app (route) + Tishadow
function start() {
	var initialSchema = T('util').parseSchema();
	if (initialSchema) {
		route(initialSchema);
	} else if (ENV_DEVELOPMENT && Alloy.CFG.tishadow.route) {
		route( Alloy.CFG.tishadow.route );
	}
}
exports.start = start;