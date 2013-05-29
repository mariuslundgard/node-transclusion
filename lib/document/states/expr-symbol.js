
/*!
 * Transclusion - states - ExprSymbol
 * Copyright(c) 2013 Marius Lundgård <marius.lundgard@gmail.com>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var State = require('./state');

/**
 * Initialize a new `ExprSymbol` with an optional `state`.
 *
 * @param {State} state
 * @api public
 */

var ExprSymbol = module.exports = function ExprSymbol(lexer){
  this.lexer = lexer;
};

/**
 * Inherit from `State`.
 */

ExprSymbol.prototype.__proto__ = State.prototype;

ExprSymbol.prototype.process = function(){
  var code = this.consume();

  switch (true) {

    case this.isWhitespace(code):
      this.emit();
      this.switchState('expr');
      break;

    case this.isLetter(code):
      this.appendVal(code);
      break;

    case '.' == code && this.isLetter(this.next()):
      this.emit();
      this.create('dot', '.');
      this.emit();
      this.create('expr-symbol', '');
      break;

    // case this.isExprSymbolChar(code):
    //   this.appendVal(code);
    //   break;

    // case '=' == code:
    //   this.emit();
    //   this.switchState('before-attr-val');
    //   break;

    default:
      throw new Error('Unexpected character: ' + code);
      break;
  }
};
