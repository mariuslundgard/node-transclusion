/*!
 * Transclusion - Document
 * Copyright(c) 2013 Marius Lundgård <marius.lundgard@gmail.com>
 * MIT Licensed
 */

var fs = require('fs');
var Parser = require('./parser');
var Compiler = require('./compiler');
var Context = require('./context');
var runtime = require('../runtime');
var nodes = require('./nodes');
var QuerySelector = require('./query-selector');

/**
 * Initialize `Document` with the given `path`.
 *
 * @param {String} path
 * @param {Object} options
 * @api public
 */

var Document = module.exports = function Document(path, options) {
  options = options || {};
  this.path = path;
  this.data = options.data || {};
  this.context = new Context(this);
  this.options = options || {};
  this.doctype = this.createDoctype('html');
  this.documentElement = this.createElement('html');
  this.parser = null;
};

/**
 * Document prototype.
 */

Document.prototype = {

  querySelector: function(selectors) {
    var results = this.querySelector.process(selectors);
    return results.length ? results[0] : null;
  },

  querySelectorAll: function(selectors) {
    this.parse();
    if (!this.querySelector) {
      this.querySelector = new QuerySelector(this);
    }
    return this.querySelector.process(selectors);
  },

  getElementsByName: function(name, immediateChild) {
    switch (name) {
      case 'html':
        return [this.documentElement];
    }

    immediateChild = immediateChild || false;
    var source = this.documentElement;
    var deferred = [];
    var results = [];
    while (source) {
      for (var i = 0; i < source.childNodes.length; i++) {
        var child = source.childNodes[i];
        if (name == child.name) {
          results.push(child);
        }
        if (!immediateChild && child.childNodes.length) {
          deferred.push(child);
        }
      }
      source = deferred.length ? deferred.shift() : false;
    }
    return results;
  },

  dump: function(){
    this.parse();
    return {
      'doctype': this.doctype.dump(),
      'documentElement': this.documentElement.dump()
    };
  },

  read: function() {
    return fs.readFileSync(this.path, 'utf8');
  },

  write: function(contents) {
    // TODO: don't assume the file is writable
    fs.writeFileSync(this.path, contents);
    return true;
  },

  removeElement: function(element) {
    if (!element.codeOffset || !element.codeLength) {
      return false;
    }
    var contents = this.read();
    var template = contents.substr(0, element.codeOffset) +
      contents.substr(element.codeOffset + element.codeLength);

    return this.write(template);
  },

  render: function(){
    this.parse();
    if (!this.compiler) {
      this.compiler = new Compiler(this);
    }
    var js = this.compiler.compile();
    var fn = '' +
      'var buf = [];\n' +
      'with (context) {\n' + js + '\n}\n' +
      'return buf.join("");';

    fn = new Function('context, transclusion', fn);
    var fn2 = function(context){ return fn(context, Object.create(runtime)); };

    return fn2(this.context);
  },

  parse: function(){
    if (!this.parser) {
      this.parser = new Parser(this);
      this.parser.parse();
    }
  },

  createDoctype: function(name){
    return new nodes.Doctype({
      name: name,
      ownerDocument: this
    });
  },

  createElement: function(name, options){
    options = options || {};
    return new nodes.Element(name, {
      ownerDocument: this,
      codeOffset: options.codeOffset,
      codeLength: undefined
    });
  },

  createExpr: function(){
    return new nodes.Expr({
      ownerDocument: this
    });
  },

  createAttr: function(name){
    return new nodes.Attr({
      ownerDocument: this,
      name: name
    });
  },

  createText: function(text){
    return new nodes.Text({
      ownerDocument: this,
      text: text
    });
  },

  createSymbol: function(name){
    return new nodes.Symbol({
      ownerDocument: this,
      name: name
    });
  },

  createDot: function(){
    return new nodes.Dot({
      ownerDocument: this
    });
  },

  createNumber: function(value){
    return new nodes.Number({
      ownerDocument: this,
      value: value
    });
  },

  createOperator: function(type){
    return new nodes.Operator({
      ownerDocument: this,
      type: type
    });
  }
};
