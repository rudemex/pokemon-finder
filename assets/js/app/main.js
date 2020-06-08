/**
 * @author (( MEX ))
 * @version 2.0
 */

define([
	'module',
	'jquery',
	'h5FormShim',
	'bootstrap',
	'bootstrap-validator',
	'svg-injector',
	'consoleFix'
], function(
	module,
	$,
	h5FormShim,
	bootstrap,
	validator,
	SVGInjector,
	consoleFix
)
{
	'use strict';

	// DISABLE CONSOLE // ---------------------------------------------------
	if (module.config().debug == false) {
		consoleFix.disableLogger();
	}
	// ----------------------------------------------------------------------

	// APP // ---------------------------------------------------------------
	const app = ( () =>{
		'use strict';

		console.log('APP closure');

		// VARS
		let winH, winW, isMobile, isTablet, scrollPos, pageID;
		let maxMobileMenuRes = 991;
		let maxTabletMenuRes = 767;
		let scrolling = false;
		let scroll_keys = {37: 1, 38: 1, 39: 1, 40: 1};

		// VALIDATE FORMS
		let formValidateOpts = {
				'disable': false,
				'focus': false,
				'errors': {
					required: 'Este campo es obligatorio.',
					match: 'Does not match',
					minlength: 'Se requiere al menos 3 caracteres.',
					maxlength: 'Not long enough'
				}
			};

		// SCROLL
		function preventDefault(e)
		{
			e = e || window.event;
			if (e.preventDefault)
				e.preventDefault();
			e.returnValue = false;
		}

		function preventDefaultForScrollKeys(e)
		{
			if (scroll_keys[e.keyCode]) {
				preventDefault(e);
				return false;
			}
		}

		function disableScroll()
		{

			if (window.addEventListener) // older FF
				window.addEventListener('DOMMouseScroll', preventDefault, false);
			window.onwheel = preventDefault; // modern standard
			window.onmousewheel = document.onmousewheel = preventDefault; // older browsers, IE
			window.ontouchmove  = preventDefault; // mobile
			document.onkeydown  = preventDefaultForScrollKeys;
		}

		function enableScroll()
		{
			if (window.removeEventListener)
				window.removeEventListener('DOMMouseScroll', preventDefault, false);
			window.onmousewheel = document.onmousewheel = null;
			window.onwheel = null;
			window.ontouchmove = null;
			document.onkeydown = null;
		}

		const onScroll = () => {
			scrollPos = $(window).scrollTop();
			// console.log('scrollPos: ' + scrollPos);
		};

		// INITIALIZE
		const initialize = (pageID) => {
			console.log('APP initialize');

			this.pageID = pageID;

			var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
			console.log('iOS: ' + iOS);

			if (iOS) {
				$('body').addClass('iOS');
			}

			$(window).scrollTop(0);

			var resizeProxy = $.proxy(resizeElements, this);
			// $(window).resize(resizeProxy).trigger('resize');
			$(window).resize( () => {
				window.setTimeout(resizeProxy, 100)
			}).trigger('resize');

			var scrollProxy = $.proxy(onScroll, this);
			$(window).scroll(scrollProxy);

			/* SVG INJECTOR */
			var mySVGsToInject = document.querySelectorAll('img.inject-me');
			SVGInjector(mySVGsToInject);
			/* END SVG INJECTOR */

			/* REMOVE FOCUS BTN AFTER CLICK */
			document.addEventListener('click', (e) => {
				if(document.activeElement.toString() == '[object HTMLButtonElement]'){
					document.activeElement.blur();
				}
			});
			/* END REMOVE FOCUS BTN AFTER CLICK */

		};

		// FINALIZE
		const finalize = () => {
			console.log('APP finalize');

			$('#overlay-preload').delay(800).fadeOut();

			$('form[name=form-search-pokemon]').validator(formValidateOpts).on('submit',  (e) => {
				console.log('search pokemon submit');

				if (e.isDefaultPrevented()) {
					console.log('form-search-pokemon INVALID');
					$('#msg-form-invalid').removeClass('hidden');
				} else {
					console.log('form-search-pokemon VALID');
					$('#msg-form-invalid').addClass('hidden');
					e.preventDefault();

					$('#btn-search-pokemon').attr("disabled", true);

					var params = {
						search: $('#id-input-search').val()
					};

					console.log('params:',params);

					$.get(md.server + '/api/search?search='+params.search, (response) => {
						console.log('response: ' + JSON.stringify(response));

						/*if(response.status == "success"){

							$('form[name=form-search-pokemon]')[0].reset();

						}else{
							console.log("Ocurrio un error al registrarte, por favor intentelo nuevamente mas tarde.");
						}*/

						$('#btn-search-pokemon').attr("disabled", false);
					});
				}
			});

		}

		// RESIZE
		const resizeElements = () => {
			console.log('resizeElements');

			winW = $(window).width();
			winH = $(window).height();
			console.log('winW: ' + winW + ', winH: ' + winH);

			isMobile = (winW > maxMobileMenuRes)?false:true;
			isTablet= (winW > maxTabletMenuRes)?false:true;
		};

		//
		const home = () => {
			console.log('Home init');
		}

		// PUBLIC METHODS
		return {
			'init': initialize,
			'finalize': finalize,
			'home': home
		}
	})();
	// ---------------------------------------------------------------------

	// DOM READY // --------------------------------------------------------
    $( () => {
    	console.info('Main.js ready');

    	const pageID = $('body').attr('id');
		console.log('pageID: ' + pageID);

    	app.init();

    	if (pageID !== '' && app[pageID] && typeof app[pageID] == 'function') {
    		app[pageID]();
    	}

    	app.finalize();
    });
    // ----------------------------------------------------------------------
});