
/*!
 * Transclusion - modes - InAttr
 * Copyright(c) 2013 Marius Lundgård <marius.lundgard@gmail.com>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var Mode = require('./mode');
var nodes = require('../nodes');

/**
 * Initialize a new `InAttr` with an optional `mode`.
 *
 * @param {Mode} mode
 * @api public
 */

var InAttr = module.exports = function InAttr(tree_builder){
  this.tree_builder = tree_builder;
};

/**
 * Inherit from `Mode`.
 */

InAttr.prototype.__proto__ = Mode.prototype;

InAttr.prototype.process = function(){
  var tok = this.advance();

  switch (tok.type) {

    case 'end-attr':
      this.popMode();
      if (nodes.Node.ATTR_NODE === this.tree_builder.node.type) {
        this.popNode();
      }
      break;

    case 'char':
      var textNode;
      if (!((textNode = this.tree_builder.node.lastChild) && nodes.Node.TEXT_NODE == textNode.type)) {
        textNode = this.insert('text', '');
      }
      textNode.text += tok.val;
      break;

    default:
      throw new Error('Unexpected token type: '+tok.type);
  }
};
