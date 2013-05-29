
/*!
 * Transclusion - modes - BeforeHtml
 * Copyright(c) 2013 Marius Lundgård <marius.lundgard@gmail.com>
 * MIT Licensed
 */

var Mode = require('./mode');
var nodes = require('../nodes');

/**
 * Initialize a new `BeforeHtml` with an optional `mode`.
 *
 * @param {Mode} mode
 * @api public
 */

var BeforeHtml = module.exports = function BeforeHtml(tree_builder){
  this.tree_builder = tree_builder;
};

/**
 * Inherit from `Mode`.
 */

BeforeHtml.prototype.__proto__ = Mode.prototype;

BeforeHtml.prototype.process = function(){
  var tok = this.advance();
  switch (tok.type) {

    case 'start-tag':
      this.switchMode('before-head');
      if ('html' == tok.val) {
        // TODO: update html element?
      } else {
        this.reprocess(tok);
      }
      break;

    case 'char':
      // TODO: ignore?
      break;

    default:
      throw new Error('Unexpected token type: '+tok.type + ' (modes/before-html)');
  }
};
