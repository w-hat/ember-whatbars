import Ember from 'ember';

export default Ember.Component.extend({
  content: null,
  whitelist: [],
  one: 'what-bars-static',
  two: undefined,
  contentChanged: Ember.observer('content', 'whitelist', function() {
    // Alternate between components so that Ember rerenders.
    if (this.get('one')) {
      this.set('one', undefined);
      this.set('two', 'what-bars-static');
    } else {
      this.set('one', 'what-bars-static');
      this.set('two', undefined);
    }
  }),
}).reopenClass({ positionalParams: ['content', 'whitelist'] });
