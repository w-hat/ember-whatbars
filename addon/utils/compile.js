// https://xkcd.com/1171

const whatbars_re = /^\{\{([a-z\-]+)([\w\d\-\_\"\'\s\=]*)\}\}$/;
const argument_re = /([\w\d\-\_]+)(?:=[\'\"]?([\w\d\-\_]+)[\'\"]?)?/g;

// TODO Support quoted whitespace.
// TODO Support blocks.
// TODO Gracefully handle conflicting positional and named paramaters.
// TODO Or just remove support for named parameters.
// TODO Smart diffing on updates.
// TODO Add meaningful start, end, and statement locations.

export default function compile(content, whitelist) {
  if (!content) { return null; }
  
  let statements = [];
  let morph_ixs = [];
  
  function buildFragment(dom) {
    let el0 = dom.createDocumentFragment();
    let el1 = dom.createElement("temporary");
    if ((typeof content === 'object') &&
        (content.constructor.name === 'SafeString')) {
      el1.innerHTML = content;
    } else {
      el1.textContent = content;
    }
    
    for (let i = 0; i < el1.childNodes.length; i++) {
      const html = el1.childNodes[i].innerHTML;
      dom.appendChild(el0, el1.childNodes[i]);
      const m = html && html.match(whatbars_re);
      const component = m && m[1];
      if (whitelist.includes(component)) {
        let named_args = [];   
        let positional_args = [];     
        for (let argsm; argsm = argument_re.exec(m[2]); ) {
		      if (argsm[2]) {
		        named_args.push(argsm[1], argsm[2]);
		      } else {
		        positional_args.push(argsm[1]);
		      }
	      }
	      const loc = ["loc",[null,[0,1],[0,1]]];
        let statement = ["inline", component, positional_args, named_args, loc];
        statements.push(statement);
        //console.log('statements:', JSON.stringify(statements));
        morph_ixs.push(i);
      }
    }
    return el0;
  }
  
  function buildRenderNodes(dom, fragment) { //, contextualElement
    var morphs = new Array(morph_ixs.length);
    for (var i in morph_ixs) {
      morphs[i] = dom.createMorphAt(dom.childAt(fragment, [morph_ixs[i]]), 0);
    }
    return morphs;
  }
  
  let template = {
    "meta": {
      "fragmentReason": {
        "name": "missing-wrapper",
        "problems": ["wrong-type", "multiple-nodes"],
      },
      "revision": "WhatBars@0.0.0",
      "loc": {
        "source": null,
        "start": { "line": 1, "column": 0 },
        "end":   { "line": 1, "column": 0 }
      }
    },
    "isEmpty": false,
    "arity": 0,
    "cachedFragment": null,
    "hasRendered": false,
    "locals": [],
    "templates": [],
    buildFragment,
    buildRenderNodes,
    statements,
  };
  
  // Wrap the content to make Ember content.
  return { meta: template.meta, arity: template.arity, raw: template };
           // render: ?
}
