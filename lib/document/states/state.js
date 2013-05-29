
/*!
 * Transclusion - states - State
 * Copyright(c) 2013 Marius Lundgård <marius.lundgard@gmail.com>
 * MIT Licensed
 */

/**
 * Initialize a `State`.
 *
 * @api public
 */

var State = module.exports = function State(lexer){
  this.lexer = lexer;
};

/**
 * Clone this node (return itself)
 *
 * @return {State}
 * @api private
 */

State.prototype = {
  clone: function(){
    return this;
  },

  consume: function(){
    return this.lexer.stream.consume();
  },

  reconsume: function(){
    return this.lexer.stream.reconsume();
  },

  switchState: function(state) {
    this.lexer.currstate = state;
  },

  emit: function(token) {
    if (!token) {
      token = this.lexer.currtoken;
      this.lexer.currtoken = null;
    }

    if (token) {
      this.lexer.stash.push(token);
      if (this.lexer.debug) {
        console.log('emit: ' + token.type + ' (' + token.val + ')')
      }
    } else {
      throw new Error('No token to emit');
    }
  },

  // currtoken: function() {
  //   return this.lexer.currtoken;
  // },

  create: function(type, val) {
    var tok = this.lexer.tok(type, val);
    this.lexer.currtoken = tok;
  },

  appendVal: function(val){
    this.lexer.currtoken.val += val;
  },

  next: function(n){
    return this.lexer.stream.next(n);
  },

  pushState: function(state) {
    this.lexer.pushState(state);
  },

  popState: function() {
    this.lexer.popState();
  },


/**********************************************************************************************************************/
/******************************                     STRING UTILS                     **********************************/
/**********************************************************************************************************************/

  isNumber: function(code) {
    return '0' <= code && code <= '9';
  },

  isLetter: function(code){
    return this.isUppercaseChar(code) || this.isLowercaseChar(code);
  },

  isUppercaseChar: function(code) {
    return 'A' <= code && code <= 'Z';
  },

  isLowercaseChar: function(code) {
    return 'a' <= code && code <= 'z';
  },

  isWhitespace: function(code) {
    return this.isTab(code) || this.isNewline(code) || " " == code;
  },

  isTab: function(code) {
    return "\t" == code;
  },

  isNewline: function(code) {
    return "\n" == code;
  },

  isAttrNameChar: function(code) {
    return this.isLetter(code) || '-' == code;
  },

  isTagNameStart: function(code) {
    return this.isLetter(code);
  },

  isTagNameChar: function(code) {
    return this.isLetter(code) || this.isNumber(code);
  },

};
