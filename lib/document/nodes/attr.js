
/*!
 * Transclusion - nodes - Attr
 * Copyright(c) 2013 Marius Lundgård <marius.lundgard@gmail.com>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var Node = require('./node');
var util = require('util');

/**
 * Initialize a new `Attr` with an optional `node`.
 *
 * @param {Node} node
 * @api public
 */

var Attr = module.exports = function Attr(options){
  Node.call(this, Node.ATTR_NODE, options || {});
  this.name = options.name;
};

/**
 * Inherit from `Node`.
 */

util.inherits(Attr, Node);
