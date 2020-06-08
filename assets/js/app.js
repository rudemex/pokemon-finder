requirejs.config({
    "baseUrl": md.server + '/js/',
    "paths": {
        "consoleFix": "common/console.fix.min",
		"jquery": "../bower_components/jquery/jquery.min",
        "bootstrap": "../bower_components/bootstrap/dist/js/bootstrap.min",
        "bootstrap-validator": "../bower_components/bootstrap-validator/dist/validator.min",
        "h5FormShim": "../bower_components/h5FormShim/build/jquery.html5form.min",
        "svg-injector": "../bower_components/svg-injector/svg-injector"
    },
    shim : {
        "console-fix": { },
        "bootstrap": {
        	"deps" :['jquery']
        },
        "h5FormShim": {
            "deps" :['jquery']
        },
        "bootstrap-validator": {
            "deps" :['jquery', 'bootstrap', 'h5FormShim']
        },
        "svg-injector": {
            "deps" :['jquery']
        }
    },
	config: {
		"app/main": {
            debug: md.debug
        }
	}
});

requirejs(["app/main"]);