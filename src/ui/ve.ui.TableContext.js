/*!
 * VisualEditor UserInterface Table Context class.
 *
 * @copyright 2011-2014 VisualEditor Team and others; see http://ve.mit-license.org
 */

/**
 * Context menu for editing tables.
 *
 * Two are usually generated for column and row actions separately.
 *
 * @class
 * @extends OO.ui.Element
 *
 * @constructor
 * @param {ve.ce.TableNode} tableNode
 * @param {string} toolGroup Tool group to use, 'table-col' or 'table-row'
 * @param {Object} [config] Configuration options
 * @cfg {string} [indicator] Indicator to use on button
 */
ve.ui.TableContext = function VeUiTableContext( tableNode, toolGroup, config ) {
	config = config || {};

	// Parent constructor
	ve.ui.TableContext.super.call( this, config );

	// Properties
	this.tableNode = tableNode;
	this.toolGroup = toolGroup;
	this.surface = tableNode.surface.getSurface();
	this.visible = false;
	this.indicator = new OO.ui.IndicatorWidget( {
		$: this.$,
		classes: ['ve-ui-tableContext-indicator'],
		indicator: config.indicator
	} );
	this.menu = new ve.ui.ContextMenuWidget( { $: this.$ } );
	this.popup = new OO.ui.PopupWidget( {
		$: this.$,
		$container: this.surface.$element,
		width: 150
	} );

	// Events
	this.indicator.$element.on( 'mousedown', this.onIndicatorMouseDown.bind( this ) );
	this.menu.connect( this, { choose: 'onContextItemChoose' } );
	this.onDocumentMouseDownHandler = this.onDocumentMouseDown.bind( this );

	// Initialization
	this.populateMenu();
	this.menu.$element.addClass( 've-ui-tableContext-menu' );
	this.popup.$body.append( this.menu.$element );
	this.$element.addClass( 've-ui-tableContext' ).append( this.indicator.$element, this.popup.$element );
};

/* Inheritance */

OO.inheritClass( ve.ui.TableContext, OO.ui.Element );

/* Methods */

/**
 * Populate menu items.
 */
ve.ui.TableContext.prototype.populateMenu = function () {
	var i, l, tool,
		items = [],
		toolList = ve.ui.toolFactory.getTools( [ { group: this.toolGroup } ] );

	this.menu.clearItems();
	for ( i = 0, l = toolList.length; i < l; i++ ) {
		tool = ve.ui.toolFactory.lookup( toolList[i] );
		items.push( new ve.ui.ContextItemWidget(
			tool.static.name, tool, this.tableNode.getModel(), { $: this.$ }
		) );
	}
	this.menu.addItems( items );
};

/**
 * Handle context item choose events.
 *
 * @param {ve.ui.ContextItemWidget} item Chosen item
 */
ve.ui.TableContext.prototype.onContextItemChoose = function ( item ) {
	if ( item ) {
		item.getCommand().execute( this.surface );
		this.toggle( false );
	}
};

/**
 * Handle mouse down events on the indicator
 *
 * @param {jQuery.Event} e Mouse down event
 */
ve.ui.TableContext.prototype.onIndicatorMouseDown = function ( e ) {
	e.preventDefault();
	this.toggle();
};

/**
 * Handle document mouse down events
 *
 * @param {jQuery.Event} e Mouse down event
 */
ve.ui.TableContext.prototype.onDocumentMouseDown = function ( e ) {
	if ( !$( e.target ).closest( this.$element ).length ) {
		this.toggle( false );
	}
};

/**
 * Toggle visibility
 *
 * @param {boolean} [show] Show the context menu
 */
ve.ui.TableContext.prototype.toggle = function ( show ) {
	this.popup.toggle( show );
	if ( this.popup.isVisible() ) {
		this.surface.getModel().connect( this, { select: 'toggle' } );
		this.surface.getView().$document.on( 'mousedown', this.onDocumentMouseDownHandler );
	} else {
		this.surface.getModel().disconnect( this );
		this.surface.getView().$document.off( 'mousedown', this.onDocumentMouseDownHandler );
	}
};
