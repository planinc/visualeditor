/*!
 * VisualEditor ContentEditable Surface class.
 *
 * @copyright 2011-2014 VisualEditor Team and others; see http://ve.mit-license.org
 */

/**
 * ContentEditable surface observer.
 *
 * @class
 * @mixins OO.EventEmitter
 *
 * @constructor
 * @param {ve.ce.Surface} surface Surface to observe
 */
ve.ce.SurfaceObserver = function VeCeSurfaceObserver( surface ) {
	// Mixin constructors
	OO.EventEmitter.call( this );

	// Properties
	this.surface = surface;
	this.documentView = surface.getDocument();
	this.domDocument = this.documentView.getDocumentNode().getElementDocument();
	this.polling = false;
	this.disabled = false;
	this.timeoutId = null;
	this.pollInterval = 250; // ms

	// Initialization
	this.clear();
};

/* Inheritance */

OO.mixinClass( ve.ce.SurfaceObserver, OO.EventEmitter );

/* Events */

/**
 * When #poll sees a change this event is emitted (before the
 * properties are updated).
 *
 * @event contentChange
 * @param {HTMLElement} node DOM node the change occured in
 * @param {Object} previous Old data
 * @param {Object} previous.text Old plain text content
 * @param {Object} previous.hash Old DOM hash
 * @param {ve.Range} previous.range Old selection
 * @param {Object} next New data
 * @param {Object} next.text New plain text content
 * @param {Object} next.hash New DOM hash
 * @param {ve.Range} next.range New selection
 */

/**
 * When #poll observes a change in the document and the new
 * selection does not equal as the last known selection, this event
 * is emitted (before the properties are updated).
 *
 * @event rangeChange
 * @param {ve.Range|null} oldRange Old range
 * @param {ve.Range|null} newRange New range
 */

/**
 * When #poll observes that the cursor was moved into a slug
 *
 * @event slugEnter
 */

/* Methods */

/**
 * Clear polling data.
 *
 * @method
 * @param {ve.Range} range Initial range to use
 */
ve.ce.SurfaceObserver.prototype.clear = function ( range ) {
	this.domRange = null;
	this.range = range || null;
	this.node = null;
	this.text = null;
	this.hash = null;
	this.$slugWrapper = null;
};

/**
 * Detach from the document view
 *
 * @method
 */
ve.ce.SurfaceObserver.prototype.detach = function () {
	this.surface = null;
	this.documentView = null;
	this.domDocument = null;
};

/**
 * Start the setTimeout synchronisation loop
 *
 * @method
 */
ve.ce.SurfaceObserver.prototype.startTimerLoop = function () {
	this.polling = true;
	this.timerLoop( true ); // will not sync immediately, because timeoutId should be null
};

/**
 * Loop once with `setTimeout`
 * @method
 * @param {boolean} firstTime Wait before polling
 */
ve.ce.SurfaceObserver.prototype.timerLoop = function ( firstTime ) {
	if ( this.timeoutId ) {
		// in case we're not running from setTimeout
		clearTimeout( this.timeoutId );
		this.timeoutId = null;
	}
	if ( !firstTime ) {
		this.pollOnce();
	}
	// only reach this point if pollOnce does not throw an exception
	if ( this.pollInterval !== null ) {
		this.timeoutId = this.setTimeout(
			this.timerLoop.bind( this ),
			this.pollInterval
		);
	}
};

/**
 * Stop polling
 *
 * @method
 */
ve.ce.SurfaceObserver.prototype.stopTimerLoop = function () {
	if ( this.polling === true ) {
		this.polling = false;
		clearTimeout( this.timeoutId );
		this.timeoutId = null;
	}
};

/**
 * Disable the surface observer
 */
ve.ce.SurfaceObserver.prototype.disable = function () {
	this.disabled = true;
};

/**
 * Enable the surface observer
 */
ve.ce.SurfaceObserver.prototype.enable = function () {
	this.disabled = false;
};

/**
 * Poll for changes.
 *
 * TODO: fixing selection in certain cases, handling selection across multiple nodes in Firefox
 *
 * FIXME: Does not work well (rangeChange is not emitted) when cursor is placed inside a slug
 * with a mouse.
 *
 * @method
 * @fires contentChange
 * @fires rangeChange
 */
ve.ce.SurfaceObserver.prototype.pollOnce = function () {
	this.pollOnceInternal( true );
};

/**
 * Poll to update SurfaceObserver, but don't emit change events
 *
 * @method
 */
ve.ce.SurfaceObserver.prototype.pollOnceNoEmit = function () {
	this.pollOnceInternal( false );
};

/**
 * Poll to update SurfaceObserver, but only check for selection changes
 *
 * Used as an optimisation when you know the content hasn't changed
 *
 * @method
 */
ve.ce.SurfaceObserver.prototype.pollOnceSelection = function () {
	this.pollOnceInternal( true, true );
};

/**
 * Poll for changes.
 *
 * TODO: fixing selection in certain cases, handling selection across multiple nodes in Firefox
 *
 * FIXME: Does not work well (rangeChange is not emitted) when cursor is placed inside a slug
 * with a mouse.
 *
 * @method
 * @private
 * @param {boolean} emitChanges Emit change events if selection changed
 * @param {boolean} selectionOnly Check for selection changes only
 * @fires contentChange
 * @fires rangeChange
 * @fires slugEnter
 */
ve.ce.SurfaceObserver.prototype.pollOnceInternal = function ( emitChanges, selectionOnly ) {
	var $nodeOrSlug, node, text, hash, range, domRange, $slugWrapper,
		anchorNodeChange = false,
		enteredSlug = false,
		leftSlug = false,
		observer = this;

	if ( !this.domDocument || this.disabled ) {
		return;
	}

	range = this.range;
	node = this.node;
	domRange = ve.ce.DomRange.newFromDocument( this.domDocument );

	if ( !domRange.equals( this.domRange ) ) {
		if ( !this.domRange || this.domRange.anchorNode !== domRange.anchorNode ) {
			anchorNodeChange = true;
		}
		range = domRange.getRange();
		this.domRange = domRange;
	}

	if ( anchorNodeChange ) {
		node = null;
		$nodeOrSlug = $( domRange.anchorNode ).closest( '.ve-ce-branchNode, .ve-ce-branchNode-blockSlugWrapper' );
		if ( $nodeOrSlug.length ) {
			if ( $nodeOrSlug.hasClass( 've-ce-branchNode-blockSlugWrapper' ) ) {
				$slugWrapper = $nodeOrSlug;
			} else {
				node = $nodeOrSlug.data( 'view' );
				// Check this node belongs to our document
				if ( node && node.root !== this.documentView.getDocumentNode() ) {
					node = null;
					range = null;
				}
			}
		}

		if ( this.$slugWrapper && !this.$slugWrapper.is( $slugWrapper ) ) {
			this.$slugWrapper
				.addClass( 've-ce-branchNode-blockSlugWrapper-unfocused' )
				.removeClass( 've-ce-branchNode-blockSlugWrapper-focused' );
			this.$slugWrapper = null;
			leftSlug = true;
		}

		if ( $slugWrapper && $slugWrapper.length && !$slugWrapper.is( this.$slugWrapper ) ) {
			this.$slugWrapper = $slugWrapper
				.addClass( 've-ce-branchNode-blockSlugWrapper-focused' )
				.removeClass( 've-ce-branchNode-blockSlugWrapper-unfocused' );
			enteredSlug = true;
		}

		if ( enteredSlug || leftSlug ) {
			// Emit 'position' on the surface view after the animation completes
			this.setTimeout( function () {
				if ( observer.surface ) {
					observer.surface.emit( 'position' );
				}
			}, 200 );
		}
	}

	if ( this.node !== node ) {
		if ( node === null ) {
			this.text = null;
			this.hash = null;
			this.node = null;
		} else {
			this.text = ve.ce.getDomText( node.$element[0] );
			this.hash = ve.ce.getDomHash( node.$element[0] );
			this.node = node;
		}
	} else if ( !selectionOnly && node !== null ) {
		text = ve.ce.getDomText( node.$element[0] );
		hash = ve.ce.getDomHash( node.$element[0] );
		if ( this.text !== text || this.hash !== hash ) {
			if ( emitChanges ) {
				this.emit(
					'contentChange',
					node,
					{
						text: this.text,
						hash: this.hash,
						range: this.range
					},
					{ text: text, hash: hash, range: range }
				);
			}
			this.text = text;
			this.hash = hash;
		}
	}

	// Only emit rangeChange event if there's a meaningful range difference
	if ( ( this.range && range ) ? !this.range.equals( range ) : ( this.range !== range ) ) {
		if ( emitChanges ) {
			this.emit(
				'rangeChange',
				this.range,
				range
			);
		}
		this.range = range;
	}

	if ( emitChanges && enteredSlug ) {
		this.emit( 'slugEnter' );
	}
};

/**
 * Wrapper for setTimeout, for ease of debugging
 *
 * @param {Function} callback Callback
 * @param {number} timeout Timeout ms
 */
ve.ce.SurfaceObserver.prototype.setTimeout = function ( callback, timeout ) {
	return setTimeout( callback, timeout );
};
