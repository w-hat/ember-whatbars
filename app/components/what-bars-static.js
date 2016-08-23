import Ember from 'ember';
import compile from 'ember-whatbars/utils/compile';

export default Ember.Component.extend({
  content: null,
  whitelist: [],
  layout: Ember.computed('content', function() {
    const content = this.get('content') || '<!-- whatbars default -->';
    return compile(content, this.get('whitelist'));
  }),
}).reopenClass({ positionalParams: ['content', 'whitelist'] });

