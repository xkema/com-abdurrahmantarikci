// ready to dive into dom.ready
$( document ).ready( function() {



	// 
	// $( '.waypoint' ).css( 'min-height', function() { return $.waypoints( 'viewportHeight' ) } );



	// find lazy loading images
	var _lazyImages = $( 'img[data-src]' );



	// current section (jquery object)
	var _activeSection;



	// find waypoints
	var _allContentWaypoints = $( '.waypoint' );



	// close events holder
	$( '#close-events-button' ).on( 'click', function() {

		// 
		$( '#imece-events-holder' ).fadeOut( 400 );

	} );


	// set smooth scrolls
	$( '#site-navigation a' ).on( 'click', function( e ) {

		// smooth scroll page
		__scrollPage( $( this ).attr( 'href' ) );

		// prevent default click action
		return false;

	} );



	// set smooth scrolls wo|waypoints
	$( '.back-to-top' ).on( 'click', function() {

		// smooth scroll page
		__scrollPage( '.sticky-wrapper' );

		// prevent default click action
		return false;

	} );



	// set site header as sticky element
	$( '#site-header' ).waypoint( 'sticky', {

		// 
		offset: function() {

			// 
			return -$( '#imece-intro' ).outerHeight();

		}

	} );



	// set content section waypoints
	$( '.waypoint' ).waypoint( function ( direction ) {

		// check direction
		if ( direction === 'down' ) {

			// switch active link styles
			__switchCurrentLinkStyles( this );

			// update active section
			__setActiveWaypoint( this );

		}

	}, {

		// change navigation current link styles when current section's top is far "offset: N" pixels from viewport's top
		offset: function() {

			// set down direction offset to N * site header
			return 2 * $( '#site-header' ).outerHeight();

		}

	} ).waypoint( function ( direction ) {

		// check direction
		if ( direction === 'up' ) {

			// switch active link styles
			__switchCurrentLinkStyles( this );

			// update active section
			__setActiveWaypoint( this );

		}

	}, {

		// 
		offset: function() {

			// when scrolling up wait until current waypoint element gone out fo window it's height's N%
			// or 100-N% of element is in view from top of viewport
			return 0.25 * -$( this ).outerHeight();

		}

	} );



	// set waypoints for lazy loading images
	_lazyImages.waypoint( function( direction ) {

		// 
		if ( direction === 'down' ) {

			// load current image
			__loadInviewImage( $( this ) );

		}

	}, {

		// trigger waypoint once (load image once)
		triggerOnce: true,
		// set offset
		offset: function() {

			// after N px when image's top enters to the viewport from bottom
			return -50 + $.waypoints( 'viewportHeight' );

		}

	} ).waypoint( function( direction ) {

		// 
		if ( direction === 'up' ) {

			// load current image
			__loadInviewImage( $( this ) );

		}

	}, {

		// trigger waypoint once (load image once)
		triggerOnce: true,
		// set offset
		offset: function() {

			// after image's top enters to viewport from top of screen
			// image height is 0 at startup so image top equals to image bottom
			return 0;

		}

	} );



	// capture "home", "end" button clicks and go end of page or to the top
	$( document ).keydown( function( e ) {

		// "end" key pressed
		if ( e.keyCode == 35 ) {

			// prevent key default
			e.preventDefault();

			// call smooth scroll manually
			__scrollPage( '#imece-outro' );

		}
		// "home" key
		else if ( e.keyCode == 36 ) {

			// prevent key default
			e.preventDefault();

			// call smooth scroll manually
			__scrollPage( '#imece-intro' );

		}
		// "down" or "page down" key pressed
		else if ( e.keyCode == 40 || e.keyCode == 34 ) {

			// prevent key default
			e.preventDefault();	


			// get next section
			if ( _allContentWaypoints.index( _activeSection ) + 1 != _allContentWaypoints.length ) 
				var _nextSectionID = _allContentWaypoints[ _allContentWaypoints.index( _activeSection ) + 1 ].id;
			else {

				// scroll to bye bye
				__scrollPage( '#missofis-info' );

				// do not call __scrollPage for next section 
				return false;

			}

			// call smooth scroll manually
			__scrollPage( '#' + _nextSectionID );

		}
		// "up" or "page up" key pressed
		else if ( e.keyCode == 38 || e.keyCode == 33 ) {

			// prevent key default
			e.preventDefault();

			// get previous section
			if ( _allContentWaypoints.index( _activeSection ) != 0 ) {

				// 
				var _prevSectionID = _allContentWaypoints[ _allContentWaypoints.index( _activeSection ) - 1 ].id;

			}
			else {

				// 
				__scrollPage( '#main-wrapper' );

				// 
				return false;

			}

			// call smooth scroll manually
			__scrollPage( '#' + _prevSectionID );			
			
		}

	} );

	

	/**
	 * Smooth scroll w|lazy load blocking
	 *
	 * @param targetElement @see smooth scroll's scrollTarget option
	 * @param boolean disableLazies (default true)
	 */
	function __scrollPage( targetElement, disableLazies ) {

		// set default argument for disableLazies
		disableLazies = typeof disableLazies !== 'undefined' ? disableLazies : true;

		// call smooth scroll manually
		$.smoothScroll( {

			// select scroll target from clicked links href attribute, each link should have a valid section corresponding to this id
			offset: 0,
			scrollTarget: targetElement,
			beforeScroll: function() {

				// disable image loading waypoints if blabla
				if ( disableLazies ) {

					// find lazy load images and disable
					// _lazyImages.not( $( targetElement ).find( 'img[data-src]' ) ).waypoint( 'disable' );
					
					// console.log( _lazyImages.not( $( targetElement ).find( 'img[data-src]' ) ) );

					// select images BEFORE target scroll element
					// selector above, selects all elements except itself, here we're selecting images before target element
					for ( var i=0; i<_allContentWaypoints.index( $( targetElement ) ); i++ ) {
						
						// disable iamges before target element
						$( _allContentWaypoints[i] ).find( 'img[data-src]' ).waypoint( 'disable' );

					}

				}				

			},
			afterScroll: function() {

				// re-enable image loading waypoints
				if ( disableLazies )
					$.waypoints( 'enable' );

			},
			easing: 'easeInOutExpo',
			speed: 600

		} );

	} /*endof:__scrollPage*/



	/**
	 * Load image if data-src attibute set
	 *
	 * @param currentImage jQuery object
	 */
	function __loadInviewImage( currentImage ) {

		// get data-src attribute
		var _imageDataSource = currentImage.attr( 'data-src' );

		// if image data source is not undefined
		if ( _imageDataSource !== undefined ) {

			// show spinner
			if ( currentImage.hasClass( 'dark-spinner-image' ) )
				currentImage.after( '<div class="spinner dark"></div>' ); // currentImage.parent( 'figure' ).addClass( 'background-spinner dark-spinner' );
			else
				currentImage.after( '<div class="spinner light"></div>' ); // currentImage.parent( 'figure' ).addClass( 'background-spinner light-spinner' );

			// add load event listener to capture image loading
			currentImage.one( 'load', function() {

				// add some styling (assign here to syncronize jQuery fade animation w|css border transition)
				currentImage.parent( 'span' ).addClass( 'image-box' );

				// show image with a fade animation ( a little latency is good always :) )
				currentImage.delay( 100 ).animate( { 'opacity':1 }, 400, function() {					

					// remove loading indicator to parent figure element
					currentImage.siblings( '.spinner' ).remove();


					// update waypoints
					$.waypoints( 'refresh' );

				} );

			} );

			// set current image's src attribute to data-src attribute (load image)
			currentImage.attr( 'src', _imageDataSource );

			// remove old attribute (to prevent later calling however it is not possible with one() event hhandler caller)
			currentImage.removeAttr( 'data-src' );

		}

	} /* endof:__loadInviewImage */


	/**
	 * Save current waypoint for up/down key handlers
	 *
	 * @param targetSection
	 */
	function __setActiveWaypoint( activeSection ) {

		// 
		_activeSection = $( activeSection );

	}



	/**
	 * Switches current link styles
	 *
	 * @param targetSection javaScript object
	 */
	function __switchCurrentLinkStyles( targetSection ) {

		// remove current section class from link
		$( '.current-section' ).removeClass( 'current-section' );

		if ( targetSection.id === 'imece-guests' ) {

			$( 'a[ href=#imece-performers ]' ).hide();
			$( 'a[ href=#imece-guests ]' ).show().css( 'display', 'inline-block' );

		}
		else if ( targetSection.id === 'imece-performers' ) {

			$( 'a[ href=#imece-guests ]' ).hide();
			$( 'a[ href=#imece-performers ]' ).show().css( 'display', 'inline-block' );

		}
		else if ( targetSection.id === 'imece-share' ) {

			$( 'a[ href=#imece-comment ]' ).hide();
			$( 'a[ href=#imece-share ]' ).show().css( 'display', 'inline-block' );

		}
		else if ( targetSection.id === 'imece-comment' ) {

			$( 'a[ href=#imece-share ]' ).hide();
			$( 'a[ href=#imece-comment ]' ).show().css( 'display', 'inline-block' );

		}

		// check if selection has single element
		if ( $( 'a[href="#' + targetSection.id  + '"]' ).length == 1 ) {

			// add current section class to new section's link
			$( 'a[href="#' + targetSection.id  + '"]' ).addClass( 'current-section' );

		}
	


	} /* endof:__switchCurrentLinkStyles */



} ); // endof document.ready