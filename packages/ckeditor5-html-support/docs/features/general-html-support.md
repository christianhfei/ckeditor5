---
category: features
modified_at: 2021-06-13
updated_at: 2021-06-14
---

# General HTML support

The general HTML support ("GHS") feature allows the user to easily enable HTML features that are not explicitly supported by any other dedicated CKEditor 5 features.

Some examples of HTML features that can be easily enabled thanks to GHS include:

* The `<section>`, `<article>`, and `<div>` elements,
* the `<audio>`, `<video>`, and `<iframe>` elements,
* the `<span>` and `<cite>` elements,
* some of the attributes on existing dedicated CKEditor 5 features:
	* `data-*` and `id` attributes on e.g. `<p>` and `<h1-h6>`,
	* `style` and `classes` on e.g. `<strong>` and `<a>`.

The enabled HTML features can be loaded (e.g. via `editor.setData()`), pasted, output (e.g. via `editor.getData()`), and are visible in the editing area. Such content can also be edited in the editor, although, to a limited extend. Read more about it in the [Level of support](#level-of-support) section.

<info-box>
	The General HTML support feature is **experimental and not yet production-ready**.

	Follow the ["Stabilize and release a production-ready General HTML support feature"](https://github.com/ckeditor/ckeditor5/issues/9856) issue for more updates and related issues.
</info-box>

## Demo

The general HTML support feature is configured via the `config.htmlSupport` property in which you need to list the HTML features that should be handled by GHS.

The demo below uses the following configuration:

```js
import SourceEditing from '@ckeditor/ckeditor5-source-editing/src/sourceediting';
import GeneralHtmlSupport from '@ckeditor/ckeditor5-html-support/src/generalhtmlsupport';

ClassicEditor
	.create( document.querySelector( '#editor' ), {
		plugins: [ SourceEditing, GeneralHtmlSupport, ... ],
		toolbar: [ 'sourceEditing', ... ],
		htmlSupport: {
			allow: {
				// Enables <div>, <details>, and <summary> elements with all kind of attributes.
				{
					name: /^(div|details|summary)$/,
					styles: true,
					classes: true,
					attributes: true
				},

				// Extends the existing Paragraph and Heading features
				// with classes and data-* attributes.
				{
					name: /^(p|h[2-4])$/,
					classes: true,
					attributes: /^data-/
				},

				// Enables <span>s with any inline styles.
				{
					name: 'span',
					styles: true
				},

				// Enables <abbr>s with the title attribute.
				{
					name: 'abbr',
					attributes: [ 'title' ]
				}
			}
		}
	} )
	.then( ... )
	.catch( ... );
```

{@snippet features/general-html-support}

## Level of support

The difference between specific CKEditor 5 features such as {@link features/basic-styles basic styles} or {@link features/headings headings} and the HTML features enabled by GHS is that a plugin that support a specific HTML feature provides a complete user experience for that feature, whereas GHS ensures only that such a content is accepted by the editor.

For instance, the dedicated {@link module:basic-styles/bold~Bold} feature offers a toolbar button used to make the selected text bold. Together with the {@link features/autoformat autoformatting feature}, it also allows for applying bold style to content by typing a Markdown shortcode (`**foo**`). The {@link features/headings headings} feature offers a dropdown from which the user can choose a heading level and ensures that pressing <kbd>Enter</kbd> at the end of a heading creates a new paragraph (and not another heading).

General HTML support does not offer any UI for the enabled features and takes only basic semantics of a given feature into account. If you enable support for `<div>`s via GHS, the user will not be able to create `<div>`s from the editor UI. The GHS will know that a `<div>` is a container element, so it can wrap other blocks (like paragraphs) but cannot be used inline (next to e.g. a `<strong>` element). But there is no more.

Therefore, GHS's main use cases would be:

* Ensuring backwards content compatibility with legacy systems.
* Introducing basic support for missing HTML features at a low cost.

<info-box>
	Taken the nature of GHS, you may consider installing the {@link features/source-editing source editing} feature alongside with it.
</info-box>

## Configuration

By default, enabling the {@link module:html-support/generalhtmlsupport~GeneralHtmlSupport} plugin does not enable support for any element. The elements the user wants to be supported, need to be configured via the {@link module:core/editor/editorconfig~EditorConfig#htmlSupport `config.htmlSupport`} option:

```js
ClassicEditor.create( document.querySelector( '#editor' ), {
	htmlSupport: {
		allow: [ /* HTML features to allow */ ]
		disallow: [ /* HTML features to disallow */ ]
	}
} )
```

The notation of the `allow` and `disallow` rules looks as follows:

```js
[
	{
		// The element name to enable and/or extend with
		// the following styles, classes and other attributes.
		name: string|regexp,

		// Styles to allow (by name, name and value or just all).
		styles: object<string=>true|string|regexp>|array<string>|true,

		// Classes to allow (by name or just all).
		classes: array<string|regexp>|true,

		// Other attributes to allow (by name, name and value or just all).
		attributes: object<string=>true|string|regexp>|array<string>|true,
	}
]
```

Several implementation examples:

```js
htmlSupport: {
	allow: [
		// Enables plain <div> elements.
		{
			name: 'div'
		},

		// Enables plain <div>, <section> and <article> elements.
		{
			name: /^(div|section|article)$/
		},

		// Enables <div>s with all inline styles (but no other attributes).
		{
			name: 'div',
			styles: true
		},

		// Enables <div>s with foo and bar classes.
		{
			name: 'div',
			classes: [ 'foo', 'bar' ]
		},

		// Adds support for `foo` and `bar` classes to the already supported
		// <p> elements (those are enabled by the specific Paragraph feature).
		{
			name: 'p',
			classes: [ 'foo', 'bar' ]
		},

		// Enables <div>s with foo="true" attribute and bar attribute that
		// can accept any value (boolean `true` value works as an asterisk).
		{
			name: 'div',
			attributes: {
				foo: 'true',
				bar: true
			}
		},

		// Adds support for style="color: *" to already supported
		// <p> and <h2-h4> elements.
		{
			name: /^(p|h[2-4])$/',
			styles: { 'color': true }
		},
}
```

The GHS feature distinguishes several content types that it treats a bit differently:

* Container elements (e.g. `<section>`, `<div>`),
* inline elements (e.g. `<span>`, `<a>`),
* and object elements (e.g. `<iframe>`, `<video>`).

Enabled elements will not be available "anywhere" in the content, as they still need to adhere to certain rules derived from the HTML schema and from common sense. Also, the behavior of specific types of elements in the editing area will be different. For instance, the object elements will only be selectable as a whole, and the inline elements will work same as other formatting features supported by CKEditor 5 (e.g. bold, italic).

## Extending specific editor features

It is possible to add support for arbitrary styles, classes and other attributes to existing CKEditor 5 features (such as paragraphs, headings, list items, etc.).

Most of the existing CKEditor 5 features can already be extended this way, however, some cannot yet. This includes:

* Some of the table and image features' markup.
* The `<ul>` and `<ol>` elements of the list feature.

<!-- TODO link the above points to specific tickets on GH -->

## Related features

There are other HTML editing related CKEditor 5 features you may want to check:

* {@link features/source-editing Source editing} &ndash; Provides the ability for viewing and editing the source of the document.
* {@link features/html-embed HTML embed} &ndash; Allows embedding an arbitrary HTML snippet in the editor. It is a more constrained and controllable approach to arbitrary HTML than GHS.

<!-- TODO link to HTML comments features once it's ready. -->

## Contribute

The source code of the feature is available on GitHub in https://github.com/ckeditor/ckeditor5/tree/master/packages/ckeditor5-media-embed.