/**
 * @license Copyright (c) 2003-2015, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

import TreeView from '/ckeditor5/engine/treeview/treeview.js';
import SelectionObserver from '/ckeditor5/engine/treeview/observer/selectionobserver.js';
import MutationObserver from '/ckeditor5/engine/treeview/observer/mutationobserver.js';
import KeyObserver from '/ckeditor5/engine/treeview/observer/keyobserver.js';
import { parse } from '/tests/engine/_utils/view.js';

const treeView = new TreeView();
treeView.createRoot( document.getElementById( 'editor' ), 'editor' );

treeView.addObserver( MutationObserver );
treeView.addObserver( SelectionObserver );
treeView.addObserver( KeyObserver );

const { view, selection } = parse(
	'<container:p><attribute:strong>foo</attribute:strong>[]<attribute:strong>bar</attribute:strong></container:p>' );

treeView.viewRoots.get( 'editor' ).appendChildren( view );

treeView.selection.setTo( selection );

treeView.on( 'selectionchange', ( evt, data ) => {
	treeView.selection.setTo( data.newSelection );
} );

treeView.render();
