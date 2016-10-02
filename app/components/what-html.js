import Ember from 'ember';

const {isHTMLSafe} = Ember.String;

export default Ember.Component.extend({
  tagName: '',
  content: null,
  sanitizer: null,
  safeContent: Ember.computed('content', 'sanitizer', function() {
    const content = this.get('content');
    const sanitizer = this.get('sanitizer');
    const html = (sanitizer ? sanitizer(content) : content);
    if ((isHTMLSafe && isHTMLSafe(html)) ||
        (html && (typeof html === 'object') &&
                 (html.constructor.name === 'SafeString'))) {
      return html;
    } else {
      return '<!-- unsafe string in whatbars -->';
    }
  }),
}).reopenClass({ positionalParams: ['content', 'sanitizer'] });

