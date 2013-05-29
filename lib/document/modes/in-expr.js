
/*!
 * Transclusion - modes - InExpr
 * Copyright(c) 2013 Marius Lundgård <marius.lundgard@gmail.com>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var Mode = require('./mode');

/**
 * Initialize a new `InExpr` with an optional `mode`.
 *
 * @param {Mode} mode
 * @api public
 */

var InExpr = module.exports = function InExpr(tree_builder){
  this.tree_builder = tree_builder;
};

/**
 * Inherit from `Mode`.
 */

InExpr.prototype.__proto__ = Mode.prototype;

InExpr.prototype.process = function(){
  var tok = this.advance();

  switch (tok.type) {

    case 'expr-symbol':
      this.insert('symbol', {name: tok.val});
      break;

    case 'expr-number':
      this.insert('number', {value: tok.val});
      break;

    case 'operator':
      this.insert('operator', {type: tok.val});
      break;

    case 'dot':
      this.insert('dot');
      break;

    case 'end-expr':
      this.popMode();
      this.popNode();
      break;

    default:
      throw new Error('Unexpected token type: '+tok.type+' (modes/in-expr)');
  }
};
