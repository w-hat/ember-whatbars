import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';

moduleForComponent('what-bars', 'Integration | Component | what bars', {
  integration: true
});

test('it should render an HTML comment by default', function(assert) {
  this.render(hbs`{{what-bars}}`);
  assert.equal(this.$().text().trim(), '');
  assert.equal(this.$().html().match('<!-- whatbars default -->').length, 1);

  // The block text is not used.
  this.render(hbs`
    {{#what-bars}}
      template block text
    {{/what-bars}}
  `);
  assert.equal(this.$().text().trim(), '');
  assert.equal(this.$().html().match('<!-- whatbars default -->').length, 1);
});

test('it should render a component in an enabled list.', function(assert) {
  this.set('content', `{{dummy-component}}`);
  this.set('enabled', ['dummy-component']);
  this.render(hbs`{{what-bars content=content enabled=enabled}}`);
  const result = 'Buffalo buffalo buffalo.';
  assert.equal(this.$().text().trim(), result);
});

test('it should render a component with an argument', function(assert) {
  this.set('content', `{{dummy-component 'police'}}`);
  this.set('enabled', {'dummy-component': true});
  this.render(hbs`{{what-bars content=content enabled=enabled}}`);
  const result = 'Buffalo buffalo buffalo, and police police police.';
  assert.equal(this.$().text().trim(), result);
});

test('it should only render components in the enabled object', function(assert) {
  this.set('content', `{{dummy-component 'dot'}}`);
  this.set('enabled', {});
  this.set('sanitizer', function(s) { return Ember.String.htmlSafe(s); });
  this.render(hbs`{{what-bars content enabled=enabled sanitizer=sanitizer}}`);
  assert.equal(this.$().text().trim(), `{{dummy-component 'dot'}}`);
});

test('it should rerender when content changes', function(assert) {
  this.set('content', `{{dummy-component 'police'}}`);
  this.set('enabled', {'dummy-component': true});
  this.render(hbs`{{what-bars content enabled}}`);
  let result = 'Buffalo buffalo buffalo, and police police police.';
  assert.equal(this.$().text().trim(), result);
  
  this.set('content', `{{dummy-component 'fish'}}`);
  result = 'Buffalo buffalo buffalo, and fish fish fish.';
  assert.equal(this.$().text().trim(), result);
});

test('it should require the sanitizer to output Ember.SafeString', function(assert) {
  this.set('content', `<a href="#" onclick="alert('BANG!')">CLICK ME</a>`);
  this.set('enabled', {});
  this.set('sanitizer', function(s) { return s; });
  this.render(hbs`{{what-bars content enabled=enabled sanitizer=sanitizer}}`);
  assert.equal(this.$().text().trim(), '');
  assert.equal(this.$().html().match('<!-- unsafe string').length, 1);
  assert.equal(this.$().html().match('BANG'), null);
});

test('it should render multiple components and sanitize', function(assert) {
  this.set('content', `Remember:
    {{dummy-component 'police'}}
    HR
    {{dummy-component 'fish'}}`);
  this.set('enabled', {'dummy-component': true});
  this.set('sanitizer', function(s) {
    return Ember.String.htmlSafe(s.replace('HR', 'horizontal rule'));
  });
  this.render(hbs`{{what-bars content enabled sanitizer}}`);
  assert.equal(this.$().text().replace(/\n\s*\n/g, '\n').trim(), `Remember:
    Buffalo buffalo buffalo, and police police police.
    horizontal rule
    Buffalo buffalo buffalo, and fish fish fish.`);
});

test('it should support block text in the content', function(assert) {
  this.set('content', `A quote:
  {{#block-quote author="Abraham Lincoln"}}
  You can't believe everything you read on the internet.
  {{/block-quote}}`);
  this.set('enabled', {'block-quote': true});
  this.set('sanitizer', function(s) {
    return Ember.String.htmlSafe(s);
  });
  this.render(hbs`{{what-bars content enabled sanitizer}}`);
  assert.equal(this.$().text().replace(/\n\s*/g, '\n    ').trim(), `A quote:
    You can't believe everything you read on the internet.
    — Abraham Lincoln`);
});

