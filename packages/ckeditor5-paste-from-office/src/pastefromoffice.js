/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/**
 * @module paste-from-office/pastefromoffice
 */

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import Clipboard from '@ckeditor/ckeditor5-clipboard/src/clipboard';

import { parseHtml } from './filters/utils';
import { transformListItemLikeElementsIntoLists } from './filters/list';

/**
 * The Paste from Office plugin.
 *
 * This plugin handles content pasted from Office apps (for now only Word) and transforms it (if necessary)
 * to a valid structure which can then be understood by the editor features.
 *
 * For more information about this feature check the {@glink api/paste-from-office package page}.
 *
 * @extends module:core/plugin~Plugin
 */
export default class PasteFromOffice extends Plugin {
	/**
	 * @inheritDoc
	 */
	static get pluginName() {
		return 'PasteFromOffice';
	}

	/**
	 * @inheritDoc
	 */
	init() {
		const editor = this.editor;

		this.listenTo( editor.plugins.get( Clipboard ), 'inputTransformation', ( evt, data ) => {
			const html = data.dataTransfer.getData( 'text/html' );

			if ( isWordInput( html ) ) {
				data.content = this._normalizeWordInput( html );
			}
		}, { priority: 'high' } );
	}

	/**
	 * Normalizes input pasted from Word to format suitable for editor {@link module:engine/model/model~Model}.
	 *
	 * **Note**: this function was exposed mainly for testing purposes and should not be called directly.
	 *
	 * @protected
	 * @param {String} input Word input.
	 * @returns {module:engine/view/documentfragment~DocumentFragment} Normalized input.
	 */
	_normalizeWordInput( input ) {
		const { body, stylesString } = parseHtml( input );
		transformListItemLikeElementsIntoLists( body, stylesString );

		return body;
	}
}

// Checks if given HTML string is a result of pasting content from Word.
//
// @param {String} html HTML string to test.
// @returns {Boolean} True if given HTML string is a Word HTML.
function isWordInput( html ) {
	return !!( html && html.match( /<meta\s*name="?generator"?\s*content="?microsoft\s*word\s*\d+"?\/?>/gi ) );
}
