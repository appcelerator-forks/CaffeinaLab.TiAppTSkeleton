// Bootstrap the framework
function T(name) { return require('T/'+name); }
T('trimethyl');

// Testflight SDK initialization
try {
	var TF = require('ti.testflight');
	if (TF) TF.takeOff(Alloy.CFG.testflight);
} catch (ex) {}

// Global modules
var GA = T('ga');
var Notifications = T('notifications');
var Auth = T('auth');
var Net = T('net');
var Flow = T('flow');
var Util = T('util');

// App main module
var App = require('app');

// Global widgets
var LoadWidg = Alloy.createWidget('com.caffeinalab.titanium.loader');
var NotifWidg = Alloy.createWidget('com.caffeinalab.titanium.notifications');
var ShareWidg = Alloy.createWidget('com.caffeinalab.titanium.sharer');

// Global app event handling
Ti.App.addEventListener('geo.start', function(){ LoadWidg.show(L('app_localizing')); });
Ti.App.addEventListener('geo.end', LoadWidg.hide);
Ti.App.addEventListener('net.start', function(){ LoadWidg.show(L('app_pleasewait')); });
Ti.App.addEventListener('net.end', function(){ if (Net.isQueueEmpty()) LoadWidg.hide(); });

// On auth success, subscribe to 'ID' channel
// and execute a global loginCallback
Ti.App.addEventListener('auth.success', function(e){
	GA.event('auth', 'success');
	if (e.id) Notifications.subscribe(e.id);
	setTimeout(App.onLogin, 500);
});

// On auth fail, display an error message
Ti.App.addEventListener('auth.fail', function(e){
	GA.event('auth', 'fail');
	if ( ! e.silent) {
		App.error(e.message);
	}
});

// On logout, unsub from notifications
Ti.App.addEventListener('auth.logout', function(e){
	if (e.id) Notifications.unsubscribe(e.id);
});

// WebView helpers
Ti.App.addEventListener('openURL', function(e){
	Ti.Platform.openURL(e.url);
});

// Sharer helper
Ti.App.addEventListener('share', function(e){
	ShareWidg.show(e);
});

// On notification received, if the app is in foreground, shows up an alert
// otherwise, if in background, just route unconditionally
Ti.App.addEventListener('notifications.received', function(e) {
	if (e.inBackground) {
		if (e.data.url) {
			App.route(e.data.url);
		}
	} else {
		if (e.data.alert) {
			NotifWidg.show({
				view: OS_ANDROID ? Flow.window() : null,
				message: e.data.alert,
				icon: e.data.image,
				click: e.data.url ? function() { App.route(e.data.url); } : null
			});
		}
	}
});

// On resume, route!
Ti.App.addEventListener('app.resumed', function(e){
	if (e.url) App.route(e.url);
});

// Set Alloy.Globals constants
Ti.UI.backgroundColor = Alloy.CFG.colors.background;

// Subscribe to notifications in the 'none' channel
Notifications.subscribe();

// Handle the auth system with memorized users
Auth.handle();

// Route initially
App.start();