import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';

moduleForComponent('what-bars', 'Integration | Component | what bars', {
  integration: true
});

test('it should render an HTML comment by default', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{what-bars}}`);

  assert.equal(this.$().text().trim(), '<!-- whatbars default -->');

  // Template block usage:
  this.render(hbs`
    {{#what-bars}}
      template block text
    {{/what-bars}}
  `);

  assert.equal(this.$().text().trim(), '<!-- whatbars default -->');
});

test('it should render a component with an argument', function(assert) {
  const html = `<p>Remember: </p>\n<p>{{dummy-component 'police'}}</p>`;
  this.set('content', Ember.String.htmlSafe(html));
  this.set('whitelist', ['dummy-component']);
  this.render(hbs`{{what-bars-static content=content whitelist=whitelist}}`);
  
  const result = 'Remember: Buffalo buffalo buffalo, and police police police.';
  assert.equal(this.$().text().trim(), result);
});

// TODO test('it should rerender when content changes');

