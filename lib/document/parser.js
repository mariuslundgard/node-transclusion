
/*!
 * Transclusion - Parser
 * Copyright(c) 2013 Marius Lundgård <marius.lundgard@gmail.com>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var Lexer = require('./lexer')
  , TreeBuilder = require('./tree-builder')

/**
 * Initialize `Parser` with the given input `str` and `filename`.
 *
 */

var Parser = module.exports = function Parser(document, options){
  this.document = document;
  this.tree_builder = new TreeBuilder(this, options);
  this.options = options;
  this.contexts = [this];
};

/**
 * Parser prototype.
 */

Parser.prototype = {

  /**
   * Push `parser` onto the context stack,
   * or pop and return a `Parser`.
   */

  context: function(parser){
    if (parser) {
      this.contexts.push(parser);
    } else {
      return this.contexts.pop();
    }
  },

  peek: function() {
    return this.lookahead(1);
  },

  lookahead: function(n){
    return this.lexer.lookahead(n);
  },

  /**
   * Return the next token object.
   *
   * @return {Object}
   * @api private
   */

  advance: function(){
    return this.lexer.advance();
  },

  /**
   * Parse input returning a string of js for evaluation.
   *
   * @return {String}
   * @api public
   */

  parse: function(){
    if (!this.lexer) {
      this.lexer = new Lexer(this.document.read(), this.options);
    }

    while ('eos' != this.peek().type) {
      this.tree_builder.process();
    }

    return this.tree_builder.document;
  }
};
