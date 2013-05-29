
/*!
 * Transclusion - nodes - Number
 * Copyright(c) 2013 Marius Lundgård <marius.lundgard@gmail.com>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var Node = require('./node');
var util = require('util');

/**
 * Initialize a new `Number` with an optional `node`.
 *
 * @param {Node} node
 * @api public
 */

var Number = module.exports = function Number(options){
  Node.call(this, Node.NUMBER_NODE, options || {});
  this.value = options.value;
};

/**
 * Inherit from `Node`.
 */

// Number.prototype.__proto__ = Node.prototype;
util.inherits(Number, Node);