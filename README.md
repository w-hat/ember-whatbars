# Ember-whatbars

This addon compiles templates into document fragments compatible with HTMLBars.
The primary use case is to provide an Ember-enabled markup language to
untrusted users.

## TL;DR Example

WhatBars allows rendering mutable content that includes Ember components:

```hbs
{{what-bars safeHTMLBarsContent whitelistOfComponentNames}}
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

WhatBars allows untrusted content to use a subset of HTMLBars syntax to
include whitelisted Ember components without requiring
`ember-template-compiler.js`.


## Usage

WhatBars provides a `what-bars` component which uses the provided content as
its layout.  The layout will rerender when the content is changed.  The
content must be an `Ember.SafeString` and the whitelist of allowable
components must be explicitely provided for any subcomponents to be rendered.

### Basic Example

For example, you might have a user-contribution component:

```js
import Ember from 'ember';
import makeShinyAndSafe from 'whatever-you-want-to-use';

export default Ember.Component.extend({
  classNames: ['user-contribution'],
  whitelist:  ['youtube-video', 'jazz-hands-component'],
  
  content: Ember.computed('userContribution', function() {
    const html = makeShinyAndSafe(this.get('userContribution'));
    return Ember.String.htmlSafe(html);
  }),
});
```

Then simply use `what-bars` in the user-contribution template:

```hbs
{{what-bars content=content whitelist=whitelist class='user-content'}}
```

If that is too wordy for you, use the positional parameters:

```hbs
{{what-bars content whitelist class='user-content'}}
```

The `makeShinyAndSafe` function could be something like:

```js
import markdownit from 'markdown-it';

function makeShinyAndSafe(str) {
  const md = markdownit({ /* markdown-it options here */ });
  return md.render(str || "");
}
```

A possible implementation of the `youtube-video` component is:

```js
import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['youtube-video'],
  v: "",
}).reopenClass({ positionalParams: ['v'] });
```

And the corresponding template might be:

```hbs
<iframe src="https://www.youtube.com/embed/{{v}}" frameborder="0"></iframe>
```

### Other Details

If the content will not change, you may prefer the `what-bars-static` component:

```hbs
{{#if content}}
  {{what-bars-static content whitelist}}
{{/if}}
```

If you want to tinker with the `compile` function itself, it is available too:

```js
import Ember from 'ember';
import compile from 'ember-whatbars/utils/compile';

const content = Ember.String.htmlSafe("<p>{{weather-component 'MI'}}</p>" +
                                      "<p>{{carousel-component}}</p>");
const whitelist = ['weather-component', 'carousel-component'];

export default Ember.Component.extend({
  layout: compile(content, whitelist),
});
```

Currently, WhatBars will only render inline components whose `{{tag}}`
makes up the entire innerHTML of a `<tag>` in the `Ember.SafeString` content.
Also, the arguments to a component may only contain a limited set of
characters (matching `/[\w\d\_\-]+/`).

Note that this addon is under development and its interface may still change
drastically.  For example, keyword parameters are currently supported but
will be removed soon to remove the risk of users causing errors by providing
the same parameter multiple times.  This will also relieve the developer of
the burden of remembering to declare non-public properties as `readOnly()`.

## Installation

* `git clone` this repository
* `npm install`
* `bower install`

## Running

* `ember serve`
* Visit your app at http://localhost:4200.

## Running Tests

* `npm test` (Runs `ember try:testall` to test your addon against multiple Ember versions)
* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [http://ember-cli.com/](http://ember-cli.com/).
