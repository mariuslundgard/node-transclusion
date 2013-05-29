/*!
 * Transclusion - Compiler
 * Copyright(c) 2013 Marius Lundgård <marius.lundgard@gmail.com>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var nodes = require('./nodes');

/**
 * Initialize `Compiler` with the given `document`.
 *
 * @param {Document} document
 * @param {Object} options
 * @api public
 */

var Compiler = module.exports = function Compiler(document, options) {
  this.options = options = options || {};
  this.document = document;
  if (this.debug) {
    console.log('document: '+document)
  }
  this.hasCompiledTag = false;
};

/**
 * Compiler prototype.
 */

Compiler.prototype = {

  /**
   * Compile parse tree to JavaScript.
   *
   * @api public
   */

  compile: function(){
    this.buf = [];
    this.lastBufferedIdx = -1;
    this.visit(this.document.doctype);
    this.visit(this.document.documentElement);
    return this.buf.join('\n');
  },

  /**
   * Visit `node`.
   *
   * @param {Node} node
   * @api public
   */

  visit: function(node){
    switch (node.type) {

      case nodes.Node.DOCTYPE_NODE:
        return this.visitDoctype(node);

      case nodes.Node.ELEMENT_NODE:
        return this.visitElement(node);

      case nodes.Node.TEXT_NODE:
        return this.visitText(node);

      case nodes.Node.ATTR_NODE:
        return this.visitAttr(node);

      case nodes.Node.EXPR_NODE:
        return this.visitExpr(node);

      case nodes.Node.SYMBOL_NODE:
        return this.visitSymbol(node);

      case nodes.Node.NUMBER_NODE:
        return this.visitNumber(node);

      case nodes.Node.OPERATOR_NODE:
        return this.visitOperator(node);

      case nodes.Node.DOT_NODE:
        return this.visitDot(node);

      default:
        console.log(node);
        throw new Error('Unexpected node: ' + node.type + ' (compiler)');
    }
  },

  visitDoctype: function(node) {
    this.buffer('<!DOCTYPE '+node.name+'>\n');
  },

  visitElement: function(node) {
    this.buffer('<');
    this.buffer(node.name);

    for (var i = 0; i < node.attrs.length; i++) {
      this.visit(node.attrs[i]);
    }

    // TODO: for editors
    // if (/*this.editor &&*/ 'html' != node.name) {
    //   this.buffer(' data-unique-selector="'+node.getUniqueSelector()+'"');
    //   // this.buffer(' data-code-index="'+node.code_index+'" data-code-length="'+node.code_length+'"');
    // }

    //
    this.buffer('>');
    if (node.isSelfClosing()) {
      return;
    }

    for (var i = 0; i < node.childNodes.length; i++) {
      this.visit(node.childNodes[i]);
    }

    this.buffer('</');
    this.buffer(node.name);
    this.buffer('>');
  },

  visitAttr: function(node) {
    this.buffer(' '+node.name);

    if (node.childNodes.length) {
      this.buffer('="');
      for (var i = 0; i < node.childNodes.length; i++) {
        var child = node.childNodes[i];
        this.buffer(child.text);
      }
      this.buffer('"');
    }
  },

  visitText: function(node) {
    this.buffer(node.text || '');
  },

  visitExpr: function(node) {
    var buf = '';

    for (var i = 0; i < node.childNodes.length; i++) {
      var child = node.childNodes[i];
      buf += this.visit(child);
    }

    this.buf.push('buf.push('+buf+');');
  },

  visitSymbol: function(node) {
    return node.name;
  },

  visitNumber: function(node) {
    return node.value;
  },

  visitOperator: function(node) {
    return ' '+node.operator+' ';
  },

  visitDot: function(node) {
    return '.';
  },


  /**
   * Buffer the given `str` exactly as is or with interpolation
   *
   * @param {String} str
   * @param {Boolean} interpolate
   * @api public
   */

  buffer: function (str, interpolate) {
    if (!str) return;

    str = JSON.stringify(str);
    str = str.substr(1, str.length - 2);

    if (this.lastBufferedIdx == this.buf.length) {
      if (this.lastBufferedType === 'code') this.lastBuffered += ' + "';
      this.lastBufferedType = 'text';
      this.lastBuffered += str;
      this.buf[this.lastBufferedIdx - 1] = 'buf.push(' + this.bufferStartChar + this.lastBuffered + '");';
    } else {
      this.buf.push('buf.push("' + str + '");');
      this.lastBufferedType = 'text';
      this.bufferStartChar = '"';
      this.lastBuffered = str;
      this.lastBufferedIdx = this.buf.length;
    }
  }

};
