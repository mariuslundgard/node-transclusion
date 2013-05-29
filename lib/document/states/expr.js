
/*!
 * Transclusion - states - Expr
 * Copyright(c) 2013 Marius Lundgård <marius.lundgard@gmail.com>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var State = require('./state');

/**
 * Initialize a new `Expr` with an optional `state`.
 *
 * @param {State} state
 * @api public
 */

var Expr = module.exports = function Expr(lexer){
  this.lexer = lexer;
};

/**
 * Inherit from `State`.
 */

Expr.prototype.__proto__ = State.prototype;

Expr.prototype.process = function(){
  var code = this.consume();

  if (!this.lexer.currtoken) {
    this.create('start-tag', '');
  }

  switch (true) {

    // GREATER THAN SIGN
    // case '>' == code:
    //   this.emit();
    //   this.switchState('data');
    //   break;

    // // SOLIDUS
    // case '/' == code:
    //   this.lexer.currToken = null;
    //   this.switchState('tag-close', '');
    //   break;

    case this.isWhitespace(code):
      // ignore
      break;

    // Operators
    case '+' == code:
    case '-' == code:
    case '/' == code:
    case '*' == code:
      this.create('operator', code);
      this.emit();
      break;

    case ']' == code && ']' == this.next():
      // throw new Error('sss');
      this.consume();
      this.popState();
      this.create('end-expr', '');
      this.emit();
      break;

    case this.isNumber(code):
      this.create('expr-number', code);
      this.switchState('expr-number');
      break;

    case this.isLetter(code):
      this.create('expr-symbol', code)
      this.switchState('expr-symbol');
      break;

    // Anything else
    default:
      // if (this.isLetter(code)) {
      //   this.appendVal(code);
      // } else {
        throw new Error('Unexpected code point: ' + code + ' in ' + __filename);
      // }
      break;
  }
};