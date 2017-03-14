import Ember from 'ember';

export default Ember.Component.extend({
  positional: [],
  params: {},
  word: Ember.computed('positional', 'params', 'block', function() {
    return "thingy";
  }),
  
});
