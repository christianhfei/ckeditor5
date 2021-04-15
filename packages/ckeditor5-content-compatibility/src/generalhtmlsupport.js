/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @module content-compatibility/generalhtmlsupport
 */

import { Plugin } from 'ckeditor5/src/core';

import DataSchema from './dataschema';
import DataFilter from './datafilter';

/**
 * The General HTML Support feature.
 *
 * This is a "glue" plugin which initializes the {@link module:content-compatibility/dataschema~DataSchema data schema}
 * and {@link module:content-compatibility/datafilter~DataFilter data filter} features.
 *
 * @extends module:core/plugin~Plugin
 */
export default class GeneralHtmlSupport extends Plugin {
	/**
	 * @param {module:core/editor/editor~Editor} editor
	*/
	constructor( editor ) {
		super( editor );

		/**
		 * An instance of the {@link module:content-compatibility/dataschema~DataSchema}.
		 *
		 * @readonly
		 * @member {module:content-compatibility/dataschema~DataSchema} #dataSchema
		 */
		this.dataSchema = new DataSchema();

		/**
		 * An instance of the {@link module:content-compatibility/datafilter~DataFilter}.
		 *
		 * @readonly
		 * @member {module:content-compatibility/datafilter~DataFilter} #dataFilter
		 */
		this.dataFilter = new DataFilter( editor, this.dataSchema );
	}

	/**
	 * @inheritDoc
	 */
	static get pluginName() {
		return 'GeneralHtmlSupport';
	}
}
