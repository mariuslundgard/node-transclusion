
/*!
 * Transclusion - states - BeforeAttrVal
 * Copyright(c) 2013 Marius Lundgård <marius.lundgard@gmail.com>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var State = require('./state');

/**
 * Initialize a new `BeforeAttrVal` with an optional `state`.
 *
 * @param {State} state
 * @api public
 */

var BeforeAttrVal = module.exports = function BeforeAttrVal(lexer){
  this.lexer = lexer;
};

/**
 * Inherit from `State`.
 */

BeforeAttrVal.prototype.__proto__ = State.prototype;

BeforeAttrVal.prototype.process = function(){
  var code = this.consume();

  // reset the attr delimeter
  this.lexer.attrDelim = '';

  switch (true) {

    case '"' == code:
    case "'" == code:
      // set the attr delimeter to either single quote (') or double-quote (")
      this.lexer.attrDelim = code;
      // this.create('attr-val', '');
      this.switchState('attr-val');
      break;

    default:
      throw new Error('Unexpected character: ' + code);
      break;
  }
};
