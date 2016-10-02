# Ember-whatbars

This addon renders Ember components embedded in mutable text content with an
HTMLBars-like syntax.  The primary use case is to provide an Ember-enabled
markup language to untrusted users.

## TL;DR Example

Suppose that `userProvidedContent` is

```md
Donald Trump and raccoons both
 * have small hands and
 * look like thieves.

{{youtube-video v='bQueaSlvjCw'}}

Do not vote for him because he is an embarrassment.
```

WhatBars allows safely rendering this content along with the Ember component:

```hbs
{{what-bars userProvidedContent enabledComponents sanitizerSuchAsMarkdownIt}}
```

## Motivation

We do not allow users to write raw HTML content in our websites for two reasons:
 * Untrusted users may stage a cross-site scripting (XSS) attack.
 * Even trusted users don't *want* to write HTML.

Addressing the first bullet point is as simple as sanitizing user input.
A popular solution for the second bullet point is to format user content with
Markdown. These methods are employeed right here in this `README.md`.

Sanitizers and markup languages such as Markdown often limit our users more
than we want.  We can use plugins to add some functionality. For example,
[markdown-it-video](https://github.com/brianjgeiger/markdown-it-video)
provides a syntax for videos from popular sites.  Integrating a `markdown-it`
plugin with Ember (Data) may prove to be difficult, though.

If we trust our user content, we could run the
[HTMLBars](https://github.com/tildeio/htmlbars) template compiler 
on the client side:

```js
import Ember from 'ember';

export default Ember.Component.extend({
  layout: Ember.computed('template', function () {
    return Ember.HTMLBars.compile(this.get('template'));
  }),
});
```

However, this requires adding approximately a megabyte (~200k gzipped) to our
application's size by including `ember-template-compiler.js` in
`ember-cli-build.js`:

```js
  app.import('bower_components/ember/ember-template-compiler.js');
```

Plus, that method does not allow the templates to change after rendering them.

WhatBars allows untrusted content to use HTMLBars-like syntax to include
Ember components without requiring `ember-template-compiler.js`.


## Usage

The `what-bars` component renders the enabled components that are embeded in
the  provided content and runs the provided sanitizer on the rest of the
content.  Only components that are explicitly enabled will be rendered,
and the sanitizer function must return an `Ember.SafeString`.

```hbs
{{what-bars content enabled sanitizer}}
```

### Basic Example

For example, you might have a user-contribution component:

```js
import Ember from 'ember';
import makeShinyAndSafe from 'whatever-you-want-to-use';

export default Ember.Component.extend({
  classNames: ['user-contribution'],
  enabled:  ['youtube-video', 'jazz-hands-component'],
  content: "",
  sanitizer(contentFragment) {
    const html = makeShinyAndSafe(contentFragment);
    return Ember.String.htmlSafe(html);
  }
});
```

Then simply use `what-bars` in the user-contribution template:

```hbs
{{what-bars content enabled sanitizer class='user-content'}}
```

Note that `enabled` may be an array of component names, or an object with
component names as keys:

```js
  enabled: {'youtube-video': true, 'jazz-hands-component': true},
```

The `makeShinyAndSafe` function could be something like:

```js
import markdownit from 'markdown-it';

function makeShinyAndSafe(str) {
  const md = markdownit({ /* markdown-it options here */ });
  return md.render(str || "");
}
```

The named arguments are provided to the component as `params` and the
positional arguments are provided as `positional`.
(This could change when Ember gets
[splat](https://github.com/wycats/handlebars.js/pull/1149).)
A possible implementation of the `youtube-video` component is:

```js
import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['youtube-video'],
  params: {},
  positional: [],
  v: Ember.computed('params', 'positional', function() {
    return this.get('params').v || this.get('positional')[0];
  }),
});
```

And the corresponding template might be:

```hbs
<iframe src="https://www.youtube.com/embed/{{v}}" frameborder="0"></iframe>
```

### Other Details

Currently, the arguments to a component may only contain a limited set of
characters (matching `/[\w\d\_\-]+/`).  Specifically, whitespace in the
component arguments is not currently suppported.

This addon used to rely on implementation details of Glimmer 1 templates.
Now it is written at a higher level so that it works with Glimmer 2 as well.

Note that this addon is under development and its interface may still change
drastically.

## Installation

* `git clone https://github.com/w-hat/ember-whatbars`
* `cd ember-whatbars`
* `npm install`
* `bower install`

## Running

* `ember serve`
* Visit your app at [http://localhost:4200](http://localhost:4200).

## Running Tests

* `npm test` (Runs `ember try:each` to test your addon against multiple Ember versions)
* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [http://ember-cli.com/](http://ember-cli.com/).
