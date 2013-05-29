
/*!
 * Transclusion - modes - InHead
 * Copyright(c) 2013 Marius Lundgård <marius.lundgard@gmail.com>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var Mode = require('./mode');

/**
 * Initialize a new `InHead` with an optional `mode`.
 *
 * @param {Mode} mode
 * @api public
 */

var InHead = module.exports = function InHead(tree_builder){
  this.tree_builder = tree_builder;
};

/**
 * Inherit from `Mode`.
 */

InHead.prototype.__proto__ = Mode.prototype;

InHead.prototype.process = function(){
  var tok = this.advance();

  switch (tok.type) {

    case 'start-tag':
      this.insert('element', {name: tok.val, codeOffset: tok.codeOffset});
      break;

    case 'end-start-tag':
      if (this.tree_builder.node.isSelfClosing()) {
        this.popNode();
      }
      break;

    case 'end-tag':
      if ('body' == tok.val) {
        this.switchMode('after-body');
      }
      this.tree_builder.node.codeLength = tok.codeOffset-this.tree_builder.node.codeOffset;
      this.popNode();
      break;

    case 'start-expr':
      this.insert('expr');
      this.pushMode('in-expr');
      break;

    case 'start-attr':
      this.insert('attr', {name: tok.val});
      this.pushMode('in-attr');
      break;

    case 'char':
      this.insert('text', {text: tok.val})
      break;

    default:
      throw new Error('Unexpected token type: '+tok.type);
  }
};
