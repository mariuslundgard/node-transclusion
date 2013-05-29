/*!
 * Transclusion - TreeBuilder
 * Copyright(c) 2013 Marius Lundgård <marius.lundgard@gmail.com>
 * MIT Licensed
 */

// var Document = require('./document');
var modes = require('./modes');
var nodes = require('./nodes');

/**
 * Initialize `TreeBuilder` with the given `str`.
 *
 * Options:
 *
 *   - `colons` allow colons for attr delimiters
 *
 * @param {String} str
 * @param {Object} options
 * @api private
 */

var TreeBuilder = module.exports = function TreeBuilder(parser, options) {
  options = options || {};
  this.parser = parser;
  this.document = parser.document;
  this.node = this.document.documentElement;
  this.nodestack = [this.node];
  this.modestack = [];
  this.modes = {};
  this.currmode = 'initial';
};

TreeBuilder.prototype = {

  pushMode: function(mode) {
    this.modestack.push(this.currmode);
    this.currmode = mode;
  },

  popMode: function() {
    if (0 == this.modestack.length) {
      throw new Error('The mode cannot be popped because the stack is empty');
    }
    this.currmode = this.modestack.pop();
  },

  process: function(){
    if (this.debug) {
      console.log('tree: ' + this.currmode);
    }
    if (!this.modes[this.currmode]) {
      this.modes[this.currmode] = modes.get(this, this.currmode);
    }
    this.modes[this.currmode].process();
  },

  popNode: function() {
    if (1 == this.nodestack.length) {
      throw new Error('The stack of open elements is already at the bottom ('+this.nodestack.length+')');
    }
    this.nodestack.pop();
    this.node = this.nodestack[this.nodestack.length-1];

    if (this.nodestack.length == 1) {
      // throw new Error('The last node was popped');
    }
  },

  pushNode: function(node){
    this.nodestack.push(node);
    this.node = node;
  },

  insert: function(type, options) {
    switch (type) {
      case 'element':
        // console.log(options);
        var node = this.document.createElement(options.name, options);
        this.node.appendChild(node);
        this.pushNode(node);
        return node;

      case 'expr':
        var node = this.document.createExpr();
        this.node.appendChild(node);
        this.pushNode(node);
        return node;

      case 'attr':
        var node = this.document.createAttr(options.name);
        this.node.appendAttr(node);
        this.pushNode(node);
        return node;

      case 'text':
        var node;
        if (this.node.lastChild && this.node.lastChild.type == nodes.Node.TEXT_NODE) {
          this.node.lastChild.text += options.text;
          node = this.node.lastChild;
        } else {
          node = this.document.createText(options.text);
          this.node.appendChild(node);
        }
        return node;

      case 'symbol':
        var node = this.document.createSymbol(options.name);
        this.node.appendChild(node);
        return node;

      case 'dot':
        var node = this.document.createDot();
        this.node.appendChild(node);
        return node;

      case 'number':
        var node = this.document.createNumber(options.value);
        this.node.appendChild(node);
        return node;

      case 'operator':
        var node = this.document.createOperator(options.type);
        this.node.appendChild(node);
        return node;

      default:
        throw new Error('Unexpected node type: ' + type + ' (tree-builder)');
    }
  },

};
