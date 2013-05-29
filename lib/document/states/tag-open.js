
/*!
 * Transclusion - states - TagOpen
 * Copyright(c) 2013 Marius Lundgård <marius.lundgard@gmail.com>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var State = require('./state');

/**
 * Initialize a new `TagOpen` with an optional `state`.
 *
 * @param {State} state
 * @api public
 */

var TagOpen = module.exports = function TagOpen(lexer){
  this.lexer = lexer;
};

/**
 * Inherit from `State`.
 */

TagOpen.prototype.__proto__ = State.prototype;

TagOpen.prototype.process = function(){
  var code = this.consume();

  switch (true) {

    // GREATER THAN SIGN
    case '>' == code:
      this.emit();
      this.create('end-start-tag', '');
      this.lexer.currtoken.codeOffset = this.lexer.stream.cursor;
      this.emit();
      this.switchState('data');
      break;

    // SOLIDUS
    case '/' == code:
      this.create('end-tag', '');
      this.switchState('tag-close', '');
      break;

    case this.isWhitespace(code):
      this.emit();
      this.switchState('before-attr-name');
      break;

    // Anything else
    default:
      if (this.isTagNameChar(code)) {
        this.appendVal(code);
      } else {
        throw new Error('Unexpected code point: ' + code + ' in ' + __filename);
      }
      break;
  }
};