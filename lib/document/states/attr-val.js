
/*!
 * Transclusion - states - AttrVal
 * Copyright(c) 2013 Marius Lundgård <marius.lundgard@gmail.com>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var State = require('./state');

/**
 * Initialize a new `AttrVal` with an optional `state`.
 *
 * @param {State} state
 * @api public
 */

var AttrVal = module.exports = function AttrVal(lexer){
  this.lexer = lexer;
};

/**
 * Inherit from `State`.
 */

AttrVal.prototype.__proto__ = State.prototype;

AttrVal.prototype.process = function(){
  var code = this.consume();

  switch (true) {

    case this.lexer.attrDelim == code:
      this.create('end-attr', '');
      this.emit();
      this.switchState('before-attr-name');
      break;

    default:
      this.create('char', code);
      this.emit();
      break;
  }
};
