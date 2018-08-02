import CodeMirror from 'codemirror';

// xml syntax highlighting
import 'codemirror/mode/xml/xml';

// auto close tags
import 'codemirror/addon/fold/xml-fold';
import 'codemirror/addon/edit/closetag';

// search addons
import 'codemirror/addon/search/search';
import 'codemirror/addon/search/searchcursor';

import 'codemirror/addon/dialog/dialog';

import 'codemirror/lib/codemirror.css';
import 'codemirror/addon/dialog/dialog.css';


/**
 * Create a code mirror instance with an editor API.
 *
 * @param  {Object} options
 * @return {CodeMirror}
 */
export default function create(options) {

  var el = this;

  var instance = CodeMirror(function(_el) {
    el = _el;
  });

  instance.attachTo = function(parentNode) {
    parentNode.appendChild(el);

    this.refresh();
  };

  instance.detach = function() {
    if (el.parentNode) {
      el.parentNode.removeChild(el);
    }
  };

  instance.destroy = function() { };

  Object.defineProperty(instance, 'lastXML', {
    get() {
      return this.getValue()
    }
  });

  return instance;
}