
/*!
 * Transclusion - nodes - Operator
 * Copyright(c) 2013 Marius Lundgård <marius.lundgard@gmail.com>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var Node = require('./node');
var util = require('util');

/**
 * Initialize a new `Operator` with an optional `node`.
 *
 * @param {Node} node
 * @api public
 */

var Operator = module.exports = function Operator(options){
  Node.call(this, Node.OPERATOR_NODE, options || {});
  // this.type = Node.OPERATOR_NODE;
  this.name = '#operator';
  // this.ownerDocument = options.ownerDocument;
  this.operator = options.type;
};

/**
 * Inherit from `Node`.
 */

util.inherits(Operator, Node);
// Operator.prototype.__proto__ = Node.prototype;
