import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';

moduleForComponent('what-bars-static', 'Integration | Component | what bars static', {
  integration: true
});

test('it should render an HTML comment by default', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{what-bars-static}}`);

  assert.equal(this.$().text().trim(), '<!-- whatbars default -->');

  // Template block usage:
  this.render(hbs`
    {{#what-bars-static}}
      template block text
    {{/what-bars-static}}
  `);
  
  assert.equal(this.$().text().trim(), '<!-- whatbars default -->');
});

test('it should require Ember.SafeString to render HTML', function(assert) {
  const html = `<a href="#" onclick="alert('BANG!')">CLICK ME</a>`;
  this.set('content', html);
  this.render(hbs`{{what-bars-static content=content}}`);
  
  // The text would be just 'CLICK ME' if the HTML was being interpreted.
  assert.equal(this.$().text().trim(), html);
});

test('it should render an Ember component', function(assert) {
  const html = '<p>A component: </p>\n<p>{{dummy-component}}</p>';
  this.set('content', Ember.String.htmlSafe(html));
  this.set('whitelist', ['dummy-component']);
  this.render(hbs`{{what-bars-static content=content whitelist=whitelist}}`);
  
  const result = 'A component: Buffalo buffalo buffalo.';
  assert.equal(this.$().text().trim(), result);
});

test('it should only render components in the whitelist', function(assert) {
  const html = `<p>A disallowed component: </p>\n<p>{{dummy-component}}</p>`;
  this.set('content', Ember.String.htmlSafe(html));
  this.set('whitelist', []);
  this.render(hbs`{{what-bars-static content=content whitelist=whitelist}}`);
  
  const result = 'A disallowed component: {{dummy-component}}';
  assert.equal(this.$().text().trim(), result);
});

