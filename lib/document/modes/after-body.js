
/*!
 * Transclusion - modes - AfterBody
 * Copyright(c) 2013 Marius Lundgård <marius.lundgard@gmail.com>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var Mode = require('./mode');
var nodes = require('../nodes');

/**
 * Initialize a new `AfterBody` with an optional `mode`.
 *
 * @param {Mode} mode
 * @api public
 */

var AfterBody = module.exports = function AfterBody(tree_builder){
  this.tree_builder = tree_builder;
};

/**
 * Inherit from `Mode`.
 */

AfterBody.prototype.__proto__ = Mode.prototype;

AfterBody.prototype.process = function(){
  var tok = this.advance();

  switch (tok.type) {

    // case 'start-tag':
    //   if ('body' == tok.val) {
    //     this.insert('element', {name: 'body'})
    //   } else {
    //     this.reprocess(tok);
    //   }
    //   this.switchMode('in-body');
    //   break;

    case 'end-tag':
      if ('html' == tok.val) {
        // ignore
      } else {
        // parse error
      }
      break;

    case 'char':
      this.insert('text', {text: tok.val});
      break;

    // case 'end-start-tag':
    //   if (this.tree_builder.node.type == Node.ATTR_NODE) {
    //     this.popOpenElements();
    //   }
    //   break;

    default:
      throw new Error('Unexpected token type: '+tok.type + ' (modes/after-body)');
  }
};
