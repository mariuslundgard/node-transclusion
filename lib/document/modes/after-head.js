
/*!
 * Transclusion - modes - AfterHead
 * Copyright(c) 2013 Marius Lundgård <marius.lundgard@gmail.com>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var Mode = require('./mode');
var nodes = require('../nodes');

/**
 * Initialize a new `AfterHead` with an optional `mode`.
 *
 * @param {Mode} mode
 * @api public
 */

var AfterHead = module.exports = function AfterHead(tree_builder){
  this.tree_builder = tree_builder;
};

/**
 * Inherit from `Mode`.
 */

AfterHead.prototype.__proto__ = Mode.prototype;

AfterHead.prototype.process = function(){
  var tok = this.advance();

  switch (tok.type) {

    case 'start-tag':
      this.switchMode('in-body');
      this.insert('element', {name: 'body'});

      if ('body' != tok.val) {
        this.reprocess(tok);
      }
      break;

    case 'char':
      this.insert('text', {text: tok.val});
      break;

    default:
      throw new Error('Unexpected token type: '+tok.type + ' (modes/after-head)');
  }
};
