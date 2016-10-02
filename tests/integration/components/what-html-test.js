import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';

moduleForComponent('what-text', 'Integration | Component | what html', {
  integration: true
});

test('it should render blank content by default', function(assert) {
  this.render(hbs`{{what-html}}`);
  assert.equal(this.$().text().trim(), '');
});

test('it should require Ember.SafeString to render HTML', function(assert) {
  this.set('content', `<a href="#" onclick="alert('BANG!')">CLICK ME</a>`);
  this.render(hbs`{{what-html content=content}}`);
  assert.equal(this.$().text().trim(), '');
  assert.equal(this.$().html().match('<!-- unsafe string').length, 1);
});

test('it should render using the sanitizer', function(assert) {
  this.set('content', "<p>She sells seashells by the seashore.</p>");
  this.set('sanitizer', function(s) {
    return Ember.String.htmlSafe(s.split(' ')[2]);
  });
  this.render(hbs`{{what-html content=content sanitizer=sanitizer}}`);
  assert.equal(this.$().text().trim(), 'seashells');
});

