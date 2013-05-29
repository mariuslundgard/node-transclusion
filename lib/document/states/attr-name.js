
/*!
 * Transclusion - states - AttrName
 * Copyright(c) 2013 Marius Lundgård <marius.lundgard@gmail.com>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var State = require('./state');

/**
 * Initialize a new `AttrName` with an optional `state`.
 *
 * @param {State} state
 * @api public
 */

var AttrName = module.exports = function AttrName(lexer){
  this.lexer = lexer;
};

/**
 * Inherit from `State`.
 */

AttrName.prototype.__proto__ = State.prototype;

AttrName.prototype.process = function(){
  var code = this.consume();

  switch (true) {

    case this.isAttrNameChar(code):
      this.appendVal(code);
      break;

    case '=' == code:
      // console.log(this.lexer.currtoken.type);
      this.emit();
      this.switchState('before-attr-val');
      break;

    default:
      throw new Error('Unexpected character: ' + code);
      break;
  }
};
