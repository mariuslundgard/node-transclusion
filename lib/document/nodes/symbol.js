
/*!
 * Transclusion - nodes - Symbol
 * Copyright(c) 2013 Marius Lundgård <marius.lundgard@gmail.com>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var Node = require('./node');
var util = require('util');

/**
 * Initialize a new `Symbol` with an optional `options`.
 *
 * @param {Node} node
 * @api public
 */

var Symbol = module.exports = function Symbol(options){
  Node.call(this, Node.SYMBOL_NODE, options || {});
  this.name = options.name;
};

/**
 * Inherit from `Node`.
 */

util.inherits(Symbol, Node);
