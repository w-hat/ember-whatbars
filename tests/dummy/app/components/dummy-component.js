import Ember from 'ember';

export default Ember.Component.extend({
  positional: [],
  params: {},
  word: Ember.computed('positional', 'params', function() {
    const positional = this.get('positional');
    if (positional.length > 0) {
      return positional[0];
    }
    const params = this.get('params');
    return params['word'];
  }),
});
