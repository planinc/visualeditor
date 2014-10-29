/*!
 * VisualEditor DataModel TableCellNode class.
 *
 * @copyright 2011-2014 VisualEditor Team and others; see http://ve.mit-license.org
 */

/**
 * DataModel table cell node.
 *
 * @class
 * @extends ve.dm.BranchNode
 *
 * @constructor
 * @param {Object} [element] Reference to element in linear model
 * @param {ve.dm.Node[]} [children]
 */
ve.dm.TableCellNode = function VeDmTableCellNode() {
	// Parent constructor
	ve.dm.BranchNode.apply( this, arguments );

	// Events
	this.connect( this, {
		attributeChange: 'onAttributeChange'
	} );
};

/* Inheritance */

OO.inheritClass( ve.dm.TableCellNode, ve.dm.BranchNode );

/* Static Properties */

ve.dm.TableCellNode.static.name = 'tableCell';

ve.dm.TableCellNode.static.parentNodeTypes = [ 'tableRow' ];

ve.dm.TableCellNode.static.defaultAttributes = { style: 'data' };

ve.dm.TableCellNode.static.matchTagNames = [ 'td', 'th' ];

// Blacklisting 'colspan' and 'rowspan' as they are managed explicitly
ve.dm.TableCellNode.static.storeHtmlAttributes = {
	blacklist: ['colspan', 'rowspan']
};

/* Static Methods */

ve.dm.TableCellNode.static.toDataElement = function ( domElements ) {
	var attributes = { style: domElements[0].nodeName.toLowerCase() === 'th' ? 'header' : 'data' },
		colspan = domElements[0].getAttribute( 'colspan' ),
		rowspan = domElements[0].getAttribute( 'rowspan' );

	if ( colspan !== null && colspan !== '' ) {
		attributes.colspan = Number( colspan );
		attributes.originalColspan = attributes.colspan;
	}

	if ( rowspan !== null && rowspan !== '' ) {
		attributes.rowspan = Number( rowspan );
		attributes.originalRowspan = attributes.rowspan;
	}

	return {
		type: this.name,
		attributes: attributes
	};
};

ve.dm.TableCellNode.static.toDomElements = function ( dataElement, doc ) {
	var tag = dataElement.attributes && dataElement.attributes.style === 'header' ? 'th' : 'td',
		domElement = doc.createElement( tag ),
		attributes = dataElement.attributes;

	// Ignore spans of 1 unless they were in the original HTML
	if ( attributes.colspan === 1 && !attributes.originalColspan ) {
		attributes.colspan = null;
	}

	if ( attributes.rowspan === 1 && !attributes.originalRowspan ) {
		attributes.rowspan = null;
	}

	ve.setDomAttributes( domElement, dataElement.attributes, [ 'colspan', 'rowspan' ] );

	return [ domElement ];
};

/**
 * Creates data that can be inserted into the model to create a new table cell.
 *
 * @param {Object} [options] An object with property 'style' which can be either 'header' or 'data'.
 * @return {Array} Model data for a new table cell
 */
ve.dm.TableCellNode.static.createData = function ( options ) {
	options = options || {};
	return [
		{
			type: 'tableCell',
			attributes: {
				style: options.style || 'data'
			}
		},
		{ type: 'paragraph' },
		{ type: '/paragraph' },
		{ type: '/tableCell' }
	];
};

/* Methods */

/**
 * Get the number of rows the cell spans
 *
 * @return {number} Rows spanned
 */
ve.dm.TableCellNode.prototype.getRowspan = function () {
	return this.element.attributes.rowspan || 1;
};

/**
 * Get the number of columns the cell spans
 *
 * @return {number} Columns spanned
 */
ve.dm.TableCellNode.prototype.getColspan = function () {
	return this.element.attributes.colspan || 1;
};

/**
 * Get number of columns and rows the cell spans
 *
 * @return {Object} Object containing 'col' and 'row'
 */
ve.dm.TableCellNode.prototype.getSpans = function () {
	return {
		col: this.getColspan(),
		row: this.getRowspan()
	};
};

/**
 * Get the style of the cell
 *
 * @return {string} Style, 'header' or 'data'
 */
ve.dm.TableCellNode.prototype.getStyle = function () {
	return this.element.attributes.style || 'data';
};

/**
 * Handle attributes changes
 *
 * @param {string} key Attribute key
 * @param {string} from Old value
 * @param {string} to New value
 */
ve.dm.TableCellNode.prototype.onAttributeChange = function ( key ) {
	if ( this.getParent() && ( key === 'colspan' || key === 'rowspan' ) ) {
		// In practice the matrix should already be invalidated as you
		// shouldn't change a span without adding/removing other cells,
		// but it is possible to just change spans if you don't mind a
		// non-rectangular table.
		this.getParent().getParent().getParent().getMatrix().invalidate();
	}
};

/* Registration */

ve.dm.modelRegistry.register( ve.dm.TableCellNode );
