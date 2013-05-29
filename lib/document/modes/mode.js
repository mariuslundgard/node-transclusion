
/*!
 * Transclusion - states - Mode
 * Copyright(c) 2013 Marius Lundgård <marius.lundgard@gmail.com>
 * MIT Licensed
 */

/**
 * Initialize a `Mode`.
 *
 * @api public
 */

var Mode = module.exports = function Mode(tree_builder){
  this.tree_builder = tree_builder;
};

Mode.prototype = {

  advance: function() {
    return this.tree_builder.parser.advance();
  },

  switchMode: function(mode) {
    this.tree_builder.currmode = mode;
  },

  pushMode: function(mode) {
    this.tree_builder.pushMode(mode);
  },

  popMode: function() {
    this.tree_builder.popMode();
  },

  reprocess: function(tok) {
    this.tree_builder.parser.lexer.stash.push(tok);
  },

  pushNode: function(node) {
    this.tree_builder.pushNode(node);
  },

  popNode: function() {
    this.tree_builder.popNode();
  },

  insert: function(type, options) {
    return this.tree_builder.insert(type, options);
  },
};
