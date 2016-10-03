import Ember from 'ember';

// https://xkcd.com/1171
const pieces_re = /(\{\{[^\}\n]*\}\})/;
const parts_re  = /^\{\{([\w\-]+)([\w\d\-\_\"\'\s\=]*)\}\}$/;
const params_re = /([\w\d\-\_]+)(?:=[\'\"]?([\w\d\-\_]+)[\'\"]?)?/g;

// TODO Support quoted whitespace.
// TODO Support blocks.
// TODO https://github.com/wycats/handlebars.js/pull/1149

function includes(collection, item) {
  return collection.length ? collection.indexOf(item) >= 0 : collection[item];
}

export default Ember.Component.extend({
  content: '',
  enabled: {},
  sanitizer: null,
  _pieces: [],
  pieces: Ember.computed('content', 'enabled', function() {
    const content = this.get('content');
    if (!content) { return []; }
    const pieces  = this.get('_pieces');
    const enabled = this.get('enabled');
    const strings = content.split(pieces_re);
    pieces.length = strings.length;
    for (let i = 0; i < strings.length; i++) {
      const string = strings[i];
      if (!(pieces[i] && (pieces[i].string == string))) {
        const parts = string.match(parts_re);
        let component = parts && parts[1];
        let params = [];
        let positional = [];
        if (includes(enabled, component)) {
          for (let argsm; argsm = params_re.exec(parts[2]); ) {
            if (argsm[2]) {
		          params[argsm[1]] = argsm[2];
		        } else {
		          positional.push(argsm[1]);
		        }
          }
        } else {
          component = null;
        }
        pieces[i] = {string, component, positional, params};
      }
    }
    return pieces;
  }),
}).reopenClass({ positionalParams: ['content', 'enabled', 'sanitizer'] });

