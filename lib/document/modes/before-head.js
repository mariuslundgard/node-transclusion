
/*!
 * Transclusion - modes - BeforeHead
 * Copyright(c) 2013 Marius Lundgård <marius.lundgard@gmail.com>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var Mode = require('./mode');
var nodes = require('../nodes');

/**
 * Initialize a new `BeforeHead` with an optional `mode`.
 *
 * @param {Mode} mode
 * @api public
 */

var BeforeHead = module.exports = function BeforeHead(tree_builder){
  this.tree_builder = tree_builder;
};

/**
 * Inherit from `Mode`.
 */

BeforeHead.prototype.__proto__ = Mode.prototype;

BeforeHead.prototype.process = function(){
  var tok = this.advance();

  switch (tok.type) {

    case 'start-tag':
      this.switchMode('in-head');

      if ('head' == tok.val) {
        this.tree_builder.document.head = this.insert('element', {name: 'head', codeOffset: tok.codeOffset});
      } else {
        this.tree_builder.document.head = this.insert('element', {name: 'head'});
        this.reprocess(tok);
      }
      break;

    case 'start-expr':
      this.insert('expr');
      this.pushMode('in-expr');
      break;

    case 'start-attr':
      this.insert('attr', {name: tok.val});
      this.pushMode('in-attr');
      break;

    case 'end-attr':
      this.popNode();
      break;

    case 'end-tag':
      this.popNode();
      break;

    case 'char':
      var textNode;
      if (!((textNode = this.tree_builder.node.lastChild) && nodes.Node.TEXT_NODE == textNode.type)) {
        textNode = this.insert('text', '');
      }
      textNode.text += tok.val;
      break;

    case 'end-start-tag':
      if (this.tree_builder.node.type == nodes.Node.ATTR_NODE) {
        this.popOpenElements();
      }
      break;

    default:
      throw new Error('Unexpected token type: '+tok.type);
  }
};
