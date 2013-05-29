
/*!
 * Transclusion - nodes - Dot
 * Copyright(c) 2013 Marius Lundgård <marius.lundgard@gmail.com>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var Node = require('./node');
var util = require('util');

/**
 * Initialize a new `Dot` with an optional `node`.
 *
 * @param {Node} node
 * @api public
 */

var Dot = module.exports = function Dot(options){
  Node.call(this, Node.DOT_NODE, options || {});
  this.name = '#dot';
};

/**
 * Inherit from `Node`.
 */

util.inherits(Dot, Node);
