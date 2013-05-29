
/*!
 * Transclusion - QuerySelector
 * Copyright(c) 2013 Marius Lundgård <marius.lundgard@gmail.com>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */
// var Node = require('./nodes').Node;

/**
 * Initialize `QuerySelector` with the given input `str` and `filename`.
 *
 * @param {String} str
 * @param {String} filename
 * @param {Object} options
 * @api public
 */

var QuerySelector = module.exports = function QuerySelector(document){
  this.document = document;
};

/**
 * QuerySelector prototype.
 */

QuerySelector.prototype = {

  // http://www.w3.org/TR/selectors-api/#the-apis
  // 6.4. Processing Selectors
  process: function(selectors) {
    var result = [];
  },


  find: function(selector) {
    // var match, elem;

    if (!selector) {
      return;
    }

    try {
      var tokens = this.parse(selector);
      var target = this.document;
      var token, previousToken, i;
      while (token = tokens.shift()) {
        switch (token.type) {

          case 'immediate-child':
            // ignore
            break;

          case 'name':
            var immediateChild = false;
            if (previousToken && 'immediate-child' == previousToken.type) {
              immediateChild = true;
              tokens.shift();
            }
            if ('[object Array]' === Object.prototype.toString.call(target)) {
              var results = [];
              var deferred = target;
              while (deferred.length) {
                var item = deferred.shift();
                // console.log("SEARCH FOR: "+token.val+" IN: " + item.name);
                for (i = 0; i < item.childNodes.length; i++) {
                  var child = item.childNodes[i];
                  // console.log('matching against: ' + child.name);
                  if (Node.ELEMENT_NODE == child.type) {
                    if (token.val == child.name) {
                      results.push(child);
                    }
                    if (!immediateChild && child.childNodes.length) {
                      deferred.push(child);
                    }
                  }
                }
              }
              target = results;
            } else {
              target = target.getElementsByName(token.val, immediateChild);
              // console.log(target);
            }
            break;

          case 'pseudo-element':
            switch (token.val) {
              case 'nth-child':
                console.log(target);
                break;
              default:
                throw new Error('Invalid pseudo-element type');
            }
            break;

          case 'pseudo-element-args':
            for (i = 0; i < target.length; i++) {
              if (token.val == target[i].index) {
                target = target[i];
              }
            }
            break;

          default:
            throw new Error('Unknown token type: ' + token.type);
        }
        previousToken = token;
      }

      // return as a single element if the target array only contains one element
      if ('[object Array]' === Object.prototype.toString.call(target) && target.length == 1) {
        target = target[0];
      }

      return target;

    } catch (err) {
      console.log(err.message);
    }
  },

  parse: function(selector) {
    var token;
    var parser = {
      cursor: 0,
      end: selector.length,
      tokens: [],
      state: 'data',
    };
    // console.log(selector);
    while (parser.cursor < parser.end) {
      var code = selector.charAt(parser.cursor);
      switch (parser.state) {

        case 'data':
          switch (true) {
            case this.isNameChar(code):
              token = {type: 'name', val: code}; // create "name" token
              parser.state = 'name'; // enter "name" state
              break;
            case '.' == code:
              token = {type: 'class', val: ''}; // create "class" token
              parser.state = 'class-start'; // enter "class-start" state
              break;
            case '>' == code:
              parser.tokens.push({type: 'immediate-child'});
              break;
            default:
              throw new Error('Unexpected character in query selector (data): ' + code);
          }
          break;

        case 'name':
          switch (true) {
            case this.isNameChar(code):
              token.val += code; // append name
              break;
            case ':' == code:
              parser.tokens.push(token); // emit token
              parser.state = 'pseudo-element-start';
              break;
            default:
              parser.tokens.push(token); // emit token
              parser.cursor--; // reconsume
              parser.state = 'data'; // in "data" state
              break;
          }
          break;

        case 'class-start':
          switch (true) {
            case this.isClassStart(code):
              token.val += code; // append class name
              break;
            default:
              throw new Error('Unexpected character in query selector (class-start): ' + code);
          }
          break;

        case 'pseudo-element-start':
          switch (true) {
            case this.isPseudoElementStart(code):
              token = {type: 'pseudo-element', val: code}; // create token
              parser.state = 'pseudo-element'; // enter "pseudo-element" state
              break;
            default:
              throw new Error('Unexpected character in query selector (pseudo-element-start): ' + code);
          }
          break;

        case 'pseudo-element':
          switch (true) {
            case this.isPseudoElementChar(code):
              token.val += code; // append pseudo-element name
              break;
            case '(' == code:
              parser.tokens.push(token);
              token = {type: 'pseudo-element-args', val: ''};
              parser.state = 'pseudo-element-args';
              break;
            default:
              throw new Error('Unexpected character in query selector (pseudo-element): ' + code);
          }
          break;

        case 'pseudo-element-args':
          switch (true) {
            case this.isPseudoElementArgsChar(code):
              token.val += code; // append pseudo-element argument value
              break;
            case ')' == code:
              parser.tokens.push(token); // emit token
              parser.state = 'data'; // enter "data" state
              break;
            default:
              throw new Error('Unexpected character in query selector (pseudo-element-args): ' + code);
          }
          break;

        default:
          throw new Error('Unknown state: ' + parser.state);
      }
      parser.cursor++;
    }

    // emit last created token
    parser.tokens.push(token);

    return parser.tokens;
  },

  isPseudoElementArgsChar: function(code) {
    return this.isNumber(code);
  },

  isNumber: function(code) {
    return '0' <= code && code <= '9';
  },

  isPseudoElementStart: function(code) {
    return this.isLetter(code);
  },

  isPseudoElementChar: function(code) {
    return this.isLetter(code) || '-' == code;
  },

  isNameChar: function(code) {
    return this.isLowerCase(code);
  },

  isLetter: function(code) {
    return this.isLowerCase(code) || this.isUpperCase(code);
  },

  isLowerCase: function(code) {
    return 'a' <= code && code <= 'z';
  },

  isUpperCase: function(code) {
    return 'A' <= code && code <= 'Z';
  },
};
