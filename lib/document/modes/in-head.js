
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
      if (['title', 'style', 'base', 'link', 'meta', 'script', 'noscript'].indexOf(tok.val) < 0) {
        this.popNode();
        this.switchMode('after-head');
        this.reprocess(tok);
      } else {
        this.insert('element', {name: tok.val, codeOffset: tok.codeOffset});
      }
      break;

    case 'end-start-tag':
      if (this.tree_builder.node.isSelfClosing()) {
        this.tree_builder.node.code_length = tok.codeOffset-this.tree_builder.node.codeOffset;
        this.popNode();
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

    case 'char':
      this.insert('text', {text: tok.val})
      break;

    case 'end-tag':
      if ('head' == tok.val) {
        this.switchMode('after-head');
      } else {
        console.log('close: '+tok.val+ ' ('+this.tree_builder.node.name+')');
      }
      this.tree_builder.node.code_length = tok.codeOffset-this.tree_builder.node.codeOffset;
      this.popNode();
      break;

    default:
      throw new Error('Unexpected token type: '+tok.type + ' (modes/in-head)');
  }
};
