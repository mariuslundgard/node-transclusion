
/*!
 * Transclusion - states - Data
 * Copyright(c) 2013 Marius Lundgård <marius.lundgard@gmail.com>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var State = require('./state');

/**
 * Initialize a new `Data` with an optional `state`.
 *
 * @param {State} state
 * @api public
 */

var Data = module.exports = function Data(lexer){
  this.lexer = lexer;
};

/**
 * Inherit from `State`.
 */

Data.prototype.__proto__ = State.prototype;

Data.prototype.process = function(){
  var code = this.consume();

  switch (true) {

    // LESS-THAN SIGN
    case '<' == code:
      this.create('start-tag', '');
      this.lexer.currtoken.codeOffset = this.lexer.stream.cursor;
      this.switchState('tag-open');
      break;

    case '[' == code && '[' == this.next():
      this.consume();
      this.create('start-expr', '');
      this.emit();
      this.pushState('expr');
      break;

    // EOS
    case -1 == code:
      this.switchState('eos');
      break;

    // Anything else
    default:
      this.emit(this.create('char', code));
      break;
  }
};