
/*!
 * Transclusion - states - BeforeAttrName
 * Copyright(c) 2013 Marius Lundgård <marius.lundgard@gmail.com>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var State = require('./state');

/**
 * Initialize a new `BeforeAttrName` with an optional `state`.
 *
 * @param {State} state
 * @api public
 */

var BeforeAttrName = module.exports = function BeforeAttrName(lexer){
  this.lexer = lexer;
};

/**
 * Inherit from `State`.
 */

BeforeAttrName.prototype.__proto__ = State.prototype;

BeforeAttrName.prototype.process = function(){
  var code = this.consume();

  switch (true) {

    case this.isWhitespace(code):
      // ignore
      break;

    //
    case this.isAttrNameChar(code):
      this.create('start-attr', '');
      this.switchState('attr-name');
      this.reconsume();
      break;

    // GREATER-THAN SIGN
    case '>' == code:
      // end-start-tag
      this.create('end-start-tag', '');
      this.lexer.currtoken.codeOffset = this.lexer.stream.cursor + 1;
      this.emit();
      this.switchState('data');
      break;

    // // EOS
    // case -1 == code:
    //   this.switchState('eos');
    //   break;

    // Anything else
    default:
      throw new Error('Unexpected character: ' + code);
      // this.emit(this.create('char', code));
      break;
  }
};