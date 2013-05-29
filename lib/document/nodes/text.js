
/*!
 * Transclusion - nodes - Text
 * Copyright(c) 2013 Marius Lundgård <marius.lundgard@gmail.com>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var Node = require('./node');

/**
 * Initialize a new `Text` with an optional `node`.
 *
 * @param {Node} node
 * @api public
 */

var Text = module.exports = function Text(options){
  this.type = Node.TEXT_NODE;
  this.name = '#text';
  this.ownerDocument = options.ownerDocument;
  this.text = options.text || '';
};

/**
 * Inherit from `Node`.
 */

Text.prototype.__proto__ = Node.prototype;

Text.prototype.dump = function() {
  return {
    type: 'text',
    text: this.text,
  };
};