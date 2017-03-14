import Ember from 'ember';

// TODO https://github.com/wycats/handlebars.js/pull/1149

export default Ember.Component.extend({
  content: '',
  enabled: {},
  sanitizer: null,
  _pieces: [],
  pieces: Ember.computed('content', 'enabled', function() {
    const content = this.get('content');
    if (!content) { return []; }
    const new_pieces = parse_pieces(content, this.get('enabled'));
    const pieces = this.get('_pieces');
    pieces.length = new_pieces.length;
    for (let i = 0; i < new_pieces.length; i++) {
      if (!(pieces[i] && (pieces[i].string === new_pieces[i].string))) {
        pieces[i] = new_pieces[i];
      }
    }
    return pieces;
  }),
}).reopenClass({ positionalParams: ['content', 'enabled', 'sanitizer'] });

// https://xkcd.com/1171
const main_re = /(\{\{\#?)|(?:(?:[^\{]|\{(?!\{))+)/g;
const name_re = /(?:\{\{\#?\s*([\w\-]+))|(.)\s*/g;
const args_re = /(?:\}\})|(?:([\w\-]+)\=)|([\w\-]+)|(?:\'([^\']*)\')|(?:\"([^\"]*)\")|([^\s])\s*/g;
const vals_re = /(?:\}\})|([\w\-]+)|(?:\'([^\']*)\')|(?:\"([^\"]*)\")\s*/g;
const bloc_re = /((?:[^\{]|\{(?!\{))*)(\{\{\/[\w\-]*\}\})/g;

function parse_pieces(content, enabled) {
  let pieces = [];
  let start_index = 0;
  main_loop:
  for (let main_m; main_m = main_re.exec(content); ) {
    let string, component, block;
    let positional = [];
    let params = {};
    if (main_m[1]) {
      const component_index = main_m.index;
      name_re.lastIndex = main_m.index;
      const name_m = name_re.exec(content);
      if (!name_m || !name_m[1] || !includes(enabled, name_m[1])) { continue; }
      component = name_m[1];
      const block_started = (name_m[0][2] == '#');
      args_re.lastIndex = name_m.index + name_m[0].length;
      for (let args_m; args_m = args_re.exec(content); ) {
        if (!args_m || args_m[5]) { continue main_loop; }
        if (args_m[0] === '}}') {
          main_re.lastIndex = args_re.lastIndex;
          break;
        }
        if (args_m[1]) {
          vals_re.lastIndex = args_re.lastIndex;
          let vals_m = vals_re.exec(content);
          if (!vals_m || (vals_m[0] === '}}')) {
            params[args_m[1]] = '';
            main_re.lastIndex = vals_re.lastIndex;
            break;
          }
          params[args_m[1]] = vals_m[1] || vals_m[2] || vals_m[3];
          args_re.lastIndex = vals_re.lastIndex;
          continue;
        }
        positional.push(args_m[2] || args_m[3] || args_m[4]);
      }
      if (block_started) {
        bloc_re.lastIndex = main_re.lastIndex;
        const bloc_m = bloc_re.exec(content);
        if (!bloc_m) { continue main_loop; }
        block = bloc_m[1];
        main_re.lastIndex = bloc_re.lastIndex;
      }
      if (start_index < component_index) {
        pieces.push({string: content.substring(start_index, component_index)});
      }
      // TODO: Do away with recording strings for components?
      string = content.substring(component_index, main_re.lastIndex);
      pieces.push({string, component, positional, params, block});
      start_index = main_re.lastIndex;
    }
  }
  if (start_index < content.length) {
    pieces.push({string: content.substring(start_index)});
  }
  return pieces;
}

function includes(collection, item) {
  return collection.length ? collection.indexOf(item) >= 0 : collection[item];
}

