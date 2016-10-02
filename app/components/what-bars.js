import Ember from 'ember';

// https://xkcd.com/1171
const pieces_re = /(\{\{[^\}]*\}\})/;
const parts_re  = /^\{\{([\w\-]+)([\w\d\-\_\"\'\s\=]*)\}\}$/;
const params_re   = /([\w\d\-\_]+)(?:=[\'\"]?([\w\d\-\_]+)[\'\"]?)?/g; 

// TODO Support quoted whitespace.
// TODO Support blocks.
// TODO https://github.com/wycats/handlebars.js/pull/1149

export default Ember.Component.extend({
  content: '',
  enabled: {},
  sanitizer: null,
  pieces: Ember.computed('content', 'whitelist', function() {
    const content = this.get('content');
    if (!content) { return []; }
    const enabled = this.get('enabled');
    // TODO Detect if content is already a SafeString.
    let pieces = content.split(pieces_re);
    for (let i = 0; i < pieces.length; i++) {
      const parts = pieces[i].match(parts_re);
      const component = parts && parts[1];
      if (enabled.length ? enabled.indexOf(component)>=0 : enabled[component]) {
        let params = [];
        let positional = [];
        for (let argsm; argsm = params_re.exec(parts[2]); ) {
          if (argsm[2]) {
		        params[argsm[1]] = argsm[2];
		      } else {
		        positional.push(argsm[1]);
		      }
        }
        pieces[i] = {component, positional, params};
      }
    }
    return pieces;
  }),
}).reopenClass({ positionalParams: ['content', 'enabled', 'sanitizer'] });
