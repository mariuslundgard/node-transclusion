
/*!
 * Transclusion - nodes - Doctype
 * Copyright(c) 2013 Marius Lundgård <marius.lundgard@gmail.com>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var Node = require('./node');
var util = require('util');

/**
 * Initialize a new `Doctype` with an optional `node`.
 *
 * @param {Node} node
 * @api public
 */

var Doctype = module.exports = function Doctype(options){
  Node.call(this, Node.DOCTYPE_NODE, options || {});
  this.name = options.name;
};

/**
 * Inherit from `Node`.
 */

util.inherits(Doctype, Node);

Doctype.prototype.dump = function(){
  return {
    type: 'doctype',
    name: this.name,
  };
};
