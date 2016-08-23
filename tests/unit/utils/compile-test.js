import compile from 'dummy/utils/compile';
import { module, test } from 'qunit';
import Ember from 'ember';

module('Unit | Utility | compile');

test('it should return null when the input is null', function(assert) {
  let result = compile(null, []);
  assert.equal(result, null);
});

test('it should return a blank document fragment', function(assert) {
  const result = compile('<!-- not much here -->', []);
  assert.ok(Number.isInteger(result.arity));
  assert.equal(typeof result.meta, 'object');
  assert.equal(result.raw.isEmpty, false);
  assert.equal(typeof result.raw.buildFragment, 'function');
  assert.equal(typeof result.raw.buildRenderNodes, 'function');
  assert.equal(result.raw.statements.length, 0);
});

test('it should return a document fragment with a statement', function(assert) {
  const html = "<p>One</p><p>{{two 'three'}}</p><p>four</p>";
  const result = compile(Ember.String.htmlSafe(html), ['two']);
  assert.equal(result.raw.statements, 0);
  
  // TODO Call result.raw.buildFragment(dom) with a fake dom and then:
  // assert.equal(result.raw.statements, 1);
});
