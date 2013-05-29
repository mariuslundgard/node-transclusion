
/*!
 * Transclusion - states - TagClose
 * Copyright(c) 2013 Marius Lundgård <marius.lundgard@gmail.com>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var State = require('./state');

/**
 * Initialize a new `TagClose` with an optional `state`.
 *
 * @param {State} state
 * @api public
 */

var TagClose = module.exports = function TagClose(lexer){
  this.lexer = lexer;
};

/**
 * Inherit from `State`.
 */

TagClose.prototype.__proto__ = State.prototype;

TagClose.prototype.process = function(){
  var code = this.consume();

  switch (code) {

    case '>':
      this.lexer.currtoken.codeOffset = this.lexer.stream.cursor + 1;
      this.emit();
      this.switchState('data');
      break;

    default:
      if (this.isTagNameChar(code)) {
        this.appendVal(code.toLowerCase());
      } else {
        throw new Error('Unexpected code point: ' + code);
      }
      break;
  }
};