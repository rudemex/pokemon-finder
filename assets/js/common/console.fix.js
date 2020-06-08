/*
 * Console Fix - Fix Console in IE & provide a global disable method.
 *
 * Copyright (c) 2013 ((( MEX )))
 *
 * Licensed under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 */

/**
  * Version 0.1
  *
  * Include the script before all other js scripts: <script src="js/console.fix.min.js"></script>
  * Globally disable all console output calling the disableLogger method: logger.disableLogger();
  *
  */

(function(name, definition) {
    if (typeof module != 'undefined') module.exports = definition();
    else if (typeof define == 'function' && typeof define.amd == 'object') define([], definition);
    else this[name] = definition();
}('consoleFix', function() {

	// IE CONSOLE FIX // ----------------------------------------------------
	window.console = window.console || (function(){
		var c = {}; c.log = c.warn = c.debug = c.info = c.error = c.time = c.dir = c.profile = c.clear = c.exception = c.trace = c.assert = function(){};
		return c;
	})();
	// ----------------------------------------------------------------------

	// LOGGER // ------------------------------------------------------------
	var oldConsoleLog = null;
	var oldConsoleInfo = null;
	var oldConsoleError = null;

	return {
		enableLogger : function()
		{
			if(oldConsoleLog == null)
				return;

			window['console']['log'] = oldConsoleLog;
			window['console']['info'] = oldConsoleInfo;
			window['console']['error'] = oldConsoleError;
		},
		disableLogger : function()
		{
			oldConsoleLog = console.log;
			oldConsoleInfo = console.info;
			oldConsoleError = console.error;
			window['console']['log'] = function() {};
			window['console']['info'] = function() {};
			window['console']['error'] = function() {};
		}
	}
	// ----------------------------------------------------------------------

}));