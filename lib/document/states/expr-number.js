
/*!
 * Transclusion - states - ExprNumber
 * Copyright(c) 2013 Marius Lundgård <marius.lundgard@gmail.com>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var State = require('./state');

/**
 * Initialize a new `ExprNumber` with an optional `state`.
 *
 * @param {State} state
 * @api public
 */

var ExprNumber = module.exports = function ExprNumber(lexer){
  this.lexer = lexer;
};

/**
 * Inherit from `State`.
 */

ExprNumber.prototype.__proto__ = State.prototype;

ExprNumber.prototype.process = function(){
  var code = this.consume();

  switch (true) {

    case this.isWhitespace(code):
      this.emit();
      this.switchState('expr');
      break;

    case this.isNumber(code):
      this.appendVal(code);
      break;

    case '.' == code && this.isNumber(this.next()):
      if (!this.lexer.currtoken.hasDecimal) {
        // set the token's "hasDecimal" flag to true
        this.lexer.currtoken.hasDecimal = true;
        this.appendVal(code);
        break;
      }

    default:
      throw new Error('Unexpected character: ' + code);
      break;
  }
};
