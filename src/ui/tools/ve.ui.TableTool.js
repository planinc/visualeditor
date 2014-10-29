/*!
 * VisualEditor UserInterface ListTool classes.
 *
 * @copyright 2011-2014 VisualEditor Team and others; see AUTHORS.txt
 * @license The MIT License (MIT); see LICENSE.txt
 */

/* Tools */

ve.ui.InsertTableTool = function VeUiInsertTableTool( toolGroup, config ) {
	ve.ui.Tool.call( this, toolGroup, config );
};
OO.inheritClass( ve.ui.InsertTableTool, ve.ui.Tool );
ve.ui.InsertTableTool.static.name = 'insertTable';
ve.ui.InsertTableTool.static.group = 'insert';
ve.ui.InsertTableTool.static.icon = 'table-insert';
ve.ui.InsertTableTool.static.title = OO.ui.deferMsg( 'visualeditor-table-insert-table' );
ve.ui.InsertTableTool.static.commandName = 'insertTable';
ve.ui.InsertTableTool.static.requiresSelection = [ 'linear' ];
ve.ui.toolFactory.register( ve.ui.InsertTableTool );

ve.ui.DeleteTableTool = function VeUiDeleteTableTool( toolGroup, config ) {
	ve.ui.Tool.call( this, toolGroup, config );
};
OO.inheritClass( ve.ui.DeleteTableTool, ve.ui.Tool );
ve.ui.DeleteTableTool.static.name = 'deleteTable';
ve.ui.DeleteTableTool.static.group = 'table';
ve.ui.DeleteTableTool.static.autoAddToCatchall = false;
ve.ui.DeleteTableTool.static.icon = 'remove';
ve.ui.DeleteTableTool.static.title = OO.ui.deferMsg( 'visualeditor-table-delete-table' );
ve.ui.DeleteTableTool.static.commandName = 'deleteTable';
ve.ui.DeleteTableTool.static.requiresSelection = [ 'table' ];
ve.ui.toolFactory.register( ve.ui.DeleteTableTool );

ve.ui.InsertRowBeforeTool = function VeUiInsertRowBeforeTool( toolGroup, config ) {
	ve.ui.Tool.call( this, toolGroup, config );
};
OO.inheritClass( ve.ui.InsertRowBeforeTool, ve.ui.Tool );
ve.ui.InsertRowBeforeTool.static.name = 'insertRowBefore';
ve.ui.InsertRowBeforeTool.static.group = 'table-row';
ve.ui.InsertRowBeforeTool.static.autoAddToCatchall = false;
ve.ui.InsertRowBeforeTool.static.icon = 'table-insert-row-before';
ve.ui.InsertRowBeforeTool.static.title =
	OO.ui.deferMsg( 'visualeditor-table-insert-row-before' );
ve.ui.InsertRowBeforeTool.static.commandName = 'insertRowBefore';
ve.ui.InsertRowBeforeTool.static.requiresSelection = [ 'table' ];
ve.ui.toolFactory.register( ve.ui.InsertRowBeforeTool );

ve.ui.InsertRowAfterTool = function VeUiInsertRowAfterTool( toolGroup, config ) {
	ve.ui.Tool.call( this, toolGroup, config );
};
OO.inheritClass( ve.ui.InsertRowAfterTool, ve.ui.Tool );
ve.ui.InsertRowAfterTool.static.name = 'insertRowAfter';
ve.ui.InsertRowAfterTool.static.group = 'table-row';
ve.ui.InsertRowAfterTool.static.autoAddToCatchall = false;
ve.ui.InsertRowAfterTool.static.icon = 'table-insert-row-after';
ve.ui.InsertRowAfterTool.static.title =
	OO.ui.deferMsg( 'visualeditor-table-insert-row-after' );
ve.ui.InsertRowAfterTool.static.commandName = 'insertRowAfter';
ve.ui.InsertRowAfterTool.static.requiresSelection = [ 'table' ];
ve.ui.toolFactory.register( ve.ui.InsertRowAfterTool );

ve.ui.DeleteRowTool = function VeUiDeleteRowTool( toolGroup, config ) {
	ve.ui.Tool.call( this, toolGroup, config );
};
OO.inheritClass( ve.ui.DeleteRowTool, ve.ui.Tool );
ve.ui.DeleteRowTool.static.name = 'deleteRow';
ve.ui.DeleteRowTool.static.group = 'table-row';
ve.ui.DeleteRowTool.static.autoAddToCatchall = false;
ve.ui.DeleteRowTool.static.icon = 'remove';
ve.ui.DeleteRowTool.static.title =
	OO.ui.deferMsg( 'visualeditor-table-delete-row' );
ve.ui.DeleteRowTool.static.commandName = 'deleteRow';
ve.ui.DeleteRowTool.static.requiresSelection = [ 'table' ];
ve.ui.toolFactory.register( ve.ui.DeleteRowTool );

ve.ui.InsertColumnBeforeTool = function VeUiInsertColumnBeforeTool( toolGroup, config ) {
	ve.ui.Tool.call( this, toolGroup, config );
};
OO.inheritClass( ve.ui.InsertColumnBeforeTool, ve.ui.Tool );
ve.ui.InsertColumnBeforeTool.static.name = 'insertColumnBefore';
ve.ui.InsertColumnBeforeTool.static.group = 'table-col';
ve.ui.InsertColumnBeforeTool.static.autoAddToCatchall = false;
ve.ui.InsertColumnBeforeTool.static.icon = 'table-insert-column-before';
ve.ui.InsertColumnBeforeTool.static.title =
	OO.ui.deferMsg( 'visualeditor-table-insert-col-before' );
ve.ui.InsertColumnBeforeTool.static.commandName = 'insertColumnBefore';
ve.ui.InsertColumnBeforeTool.static.requiresSelection = [ 'table' ];
ve.ui.toolFactory.register( ve.ui.InsertColumnBeforeTool );

ve.ui.InsertColumnAfterTool = function VeUiInsertColumnAfterTool( toolGroup, config ) {
	ve.ui.Tool.call( this, toolGroup, config );
};
OO.inheritClass( ve.ui.InsertColumnAfterTool, ve.ui.Tool );
ve.ui.InsertColumnAfterTool.static.name = 'insertColumnAfter';
ve.ui.InsertColumnAfterTool.static.group = 'table-col';
ve.ui.InsertColumnAfterTool.static.autoAddToCatchall = false;
ve.ui.InsertColumnAfterTool.static.icon = 'table-insert-column-after';
ve.ui.InsertColumnAfterTool.static.title =
	OO.ui.deferMsg( 'visualeditor-table-insert-col-after' );
ve.ui.InsertColumnAfterTool.static.commandName = 'insertColumnAfter';
ve.ui.InsertColumnAfterTool.static.requiresSelection = [ 'table' ];
ve.ui.toolFactory.register( ve.ui.InsertColumnAfterTool );

ve.ui.DeleteColumnTool = function VeUiDeleteColumnTool( toolGroup, config ) {
	ve.ui.Tool.call( this, toolGroup, config );
};
OO.inheritClass( ve.ui.DeleteColumnTool, ve.ui.Tool );
ve.ui.DeleteColumnTool.static.name = 'deleteColumn';
ve.ui.DeleteColumnTool.static.group = 'table-col';
ve.ui.DeleteColumnTool.static.autoAddToCatchall = false;
ve.ui.DeleteColumnTool.static.icon = 'remove';
ve.ui.DeleteColumnTool.static.title =
	OO.ui.deferMsg( 'visualeditor-table-delete-col' );
ve.ui.DeleteColumnTool.static.commandName = 'deleteColumn';
ve.ui.DeleteColumnTool.static.requiresSelection = [ 'table' ];
ve.ui.toolFactory.register( ve.ui.DeleteColumnTool );

ve.ui.MergeCellsTool = function VeUiMergeCellsTool( toolGroup, config ) {
	ve.ui.Tool.call( this, toolGroup, config );
};
OO.inheritClass( ve.ui.MergeCellsTool, ve.ui.Tool );
ve.ui.MergeCellsTool.static.name = 'mergeCells';
ve.ui.MergeCellsTool.static.group = 'table';
ve.ui.MergeCellsTool.static.autoAddToCatchall = false;
ve.ui.MergeCellsTool.static.icon = 'table-merge-cells';
ve.ui.MergeCellsTool.static.title =
	OO.ui.deferMsg( 'visualeditor-table-merge-cells' );
ve.ui.MergeCellsTool.static.commandName = 'mergeCells';
ve.ui.MergeCellsTool.static.requiresSelection = [ 'table' ];
ve.ui.MergeCellsTool.static.deactivateOnSelect = false;

ve.ui.MergeCellsTool.prototype.onUpdateState = function ( fragment ) {
	// Parent method
	ve.ui.MergeCellsTool.super.prototype.onUpdateState.apply( this, arguments );

	var splittable, selection = fragment.getSelection();

	if ( selection instanceof ve.dm.TableSelection ) {
		if ( selection.isSingleCell() ) {
			splittable = selection.getMatrixCells( true ).length > 1;
			this.setActive( splittable );
			this.setDisabled( !splittable );
		} else {
			this.setActive( false );
			this.setDisabled( false );
		}
	}
};

ve.ui.toolFactory.register( ve.ui.MergeCellsTool );
