
/*!
 * Transclusion - Parser
 * Copyright(c) 2013 Marius Lundgård <marius.lundgard@gmail.com>
 * MIT Licensed
 */

var states = require('./states');
var InputStream = require('../input-stream');

/**
 * Initialize `Lexer` with the given `str`.
 *
 * @param {String} str
 * @param {Object} options
 * @api private
 */

var Lexer = module.exports = function Lexer(str, options) {
  options = options || {};
  this.stream = new InputStream(str);
  this.currstate = 'data'; // initial state
  this.currtoken = null;
  this.states = {};
  this.stash = [];
  this.stack = [];
};

Lexer.prototype = {
  tok: function(type, val){
    return {type: type, val: val};
  },

  pushState: function(state) {
    this.stack.push(this.currstate);
    this.currstate = state;
  },

  popState: function() {
    if (0 === this.stack.length) {
      throw new Error('The state cannot be popped because the stack is empty');
    }
    this.currstate = this.stack.pop();
  },

  /**
   * Lookahead `n` tokens.
   *
   * @param {Number} n
   * @return {Object}
   * @api private
   */

  lookahead: function(n){
    var fetch = n - this.stash.length;
    while (fetch-- > 0) {
      this.stash.push(this.next());
    }
    return this.stash[--n];
  },

  /**
   * Return the next token object, or those
   * previously stashed by lookahead.
   *
   * @return {Object}
   * @api private
   */

  advance: function(){
    return this.stashed()
      || this.next();
  },

  /**
   * Stashed token.
   */

  stashed: function(){
    return this.stash.length
      && this.stash.shift();
  },

  next: function(){
    var token;
    if ('eos' != this.currstate) {
      while (0 === this.stash.length && 'eos' != this.currstate) {
        this.process();
      }
      if (token = this.stashed()) {
        if (!token.type) {
          throw new Error('Token needs a type: ' + token);
        }
        return token;
      }
    }

    return this.tok('eos');
  },

  process: function(){
    if (this.debug) {
      console.log('lex: ' + this.currstate + ' (' +this.stream.next()+ ')');
    }
    if (!this.states[this.currstate]) {
      this.states[this.currstate] = states.get(this, this.currstate);
    }
    this.states[this.currstate].process();
  }

};
