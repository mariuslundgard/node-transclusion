
/*!
 * Transclusion - modes - Initial
 * Copyright(c) 2013 Marius Lundgård <marius.lundgard@gmail.com>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var Mode = require('./mode');

/**
 * Initialize a new `Initial` with an optional `mode`.
 *
 * @param {Mode} mode
 * @api public
 */

var Initial = module.exports = function Initial(tree_builder){
  this.tree_builder = tree_builder;
};

/**
 * Inherit from `Mode`.
 */

Initial.prototype.__proto__ = Mode.prototype;

Initial.prototype.process = function(){
  var tok = this.advance();

  switch (tok.type) {

    case 'char':
    case 'start-tag':
      this.switchMode('before-html');
      this.reprocess(tok);
      break;

    default:
      throw new Error('Unexpected token type: '+tok.type);
  }
};