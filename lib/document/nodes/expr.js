
/*!
 * Transclusion - nodes - Expr
 * Copyright(c) 2013 Marius Lundgård <marius.lundgard@gmail.com>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var Node = require('./node');
var util = require('util');

/**
 * Initialize a new `Expr` with an optional `node`.
 *
 * @param {Node} node
 * @api public
 */

var Expr = module.exports = function Expr(options){
  Node.call(this, Node.EXPR_NODE, options || {});
  this.name = '#expr';
};

/**
 * Inherit from `Node`.
 */

util.inherits(Expr, Node);
