
/*!
 * Transclusion - nodes - Element
 * Copyright(c) 2013 Marius Lundgård <marius.lundgard@gmail.com>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var Node = require('./node');
var util = require('util');

/**
 * Initialize a new `Element` with an optional `node`.
 *
 * @param {Node} node
 * @api public
 */

var Element = module.exports = function Element(name, options){
  Node.call(this, Node.ELEMENT_NODE, options || {});
  this.name = name;
  this.id = null;
  this.codeOffset = options.codeOffset;
  this.codeLength = options.codeLength;
};

/**
 * Inherit from `Node`.
 */
util.inherits(Element, Node);

/**
 * Element flag.
 */

Element.prototype.isElement = true;

/**
 * Replace the nodes in `other` with the nodes
 * in `this` block.
 *
 * @param {Element} other
 * @api private
 */

Element.prototype.replace = function(other){
  other.nodes = this.nodes;
};

/**
 * Pust the given `node`.
 *
 * @param {Node} node
 * @return {Number}
 * @api public
 */

Element.prototype.push = function(node){
  return this.nodes.push(node);
};

/**
 * Check if this block is empty.
 *
 * @return {Boolean}
 * @api public
 */

Element.prototype.isEmpty = function(){
  return 0 == this.nodes.length;
};

/**
 * Unshift the given `node`.
 *
 * @param {Node} node
 * @return {Number}
 * @api public
 */

Element.prototype.unshift = function(node){
  return this.nodes.unshift(node);
};

/**
 * Return the "last" block, or the first `yield` node.
 *
 * @return {Element}
 * @api private
 */

Element.prototype.includeElement = function(){
  var ret = this
    , node;

  for (var i = 0, len = this.nodes.length; i < len; ++i) {
    node = this.nodes[i];
    if (node.yield) return node;
    else if (node.textOnly) continue;
    else if (node.includeElement) ret = node.includeElement();
    else if (node.block && !node.block.isEmpty()) ret = node.block.includeElement();
    if (ret.yield) return ret;
  }

  return ret;
};

/**
 * Return a clone of this block.
 *
 * @return {Element}
 * @api private
 */

Element.prototype.clone = function(){
  var clone = new Element;
  for (var i = 0, len = this.nodes.length; i < len; ++i) {
    clone.push(this.nodes[i].clone());
  }
  return clone;
};

Element.prototype.dump = function(){
  var dump = {
    type: 'element',
    name: this.name,
    index: this.index,
    codeOffset: this.codeOffset,
    codeLength: this.codeLength,
  };

  if (this.childNodes.length) {
    dump.childNodes = [];
    for (var i = 0; i < this.childNodes.length; i++) {
      dump.childNodes.push(this.childNodes[i].dump());
    }
  }

  return dump;
};

Element.prototype.isSelfClosing = function() {
  return -1 != ['meta','link'].indexOf(this.name);
}

// Element.prototype.getSelector = function() {
//   return this.name;
// }

Element.prototype.getChildren = function(name) {
  var children = [];
  for (var i = 0; i < this.childNodes.length; i++ ){
    if (name == this.childNodes[i].name) {
      children.push(this.childNodes[i]);
    }
  }
  return children;
}

Element.prototype.getUniqueSelector = function() {
  var path;
  var node = this;
  while (node.parentNode) {
      var name = node.name;
      var parent = node.parentNode;
      var siblings = parent.getChildren(name);
      if (name != 'body' && name != 'head' && siblings.length > 1) {
        name += ':nth-child(' + (node.index+1) + ')';
      }
      path = name + (path ? '>' + path : '');
      node = parent;
  }
  return path;
}

Element.prototype.remove = function() {
  return this.ownerDocument
    ? this.ownerDocument.removeElement(this)
    : false;
};
