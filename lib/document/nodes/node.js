
/*!
 * Transclusion - nodes - Node
 * Copyright(c) 2013 Marius Lundgård <marius.lundgard@gmail.com>
 * MIT Licensed
 */

var sanitize = require('validator').sanitize;

/**
 * Initialize a `Node`.
 *
 * @api public
 */

var Node = module.exports = function Node(type, options){
  var node = this;
  options = options || {};
  // this.index = 0;
  this.type = type;
  this.parentNode = null;
  this.ownerDocument = options.ownerDocument;
  this.childNodes = [];
  this.attrs = [];

  // getters
  this.__defineGetter__('lastChild', function(){
    return node.childNodes.length ? node.childNodes[node.childNodes.length-1] : null;
  });
  this.__defineGetter__('index', function(){
    if (!this.parentNode) {
      return undefined;
    }
    return this.parentNode.getIndex(this);
  });
};

Node.DOCTYPE_NODE = 8;
Node.ELEMENT_NODE = 1;
Node.TEXT_NODE = 2;
Node.ATTR_NODE = 3;
Node.EXPR_NODE = 4;
Node.SYMBOL_NODE = 5;
Node.NUMBER_NODE = 6;
Node.OPERATOR_NODE = 7;
Node.DOT_NODE = 9;

/**
 * Clone this node (return itself)
 *
 * @return {Node}
 * @api private
 */

Node.prototype.clone = function(){
  return this;
};

Node.prototype.getIndex = function(node){
  var index = 1;
  for (var i = 0; i < this.childNodes.length; i++) {
    var child = this.childNodes[i];
    if (node === child) {
      return index;
    }
    if (child.type == Node.TEXT_NODE && sanitize(child.text).trim() == '') {
      // ignore whitespace
    } else {
      index++;
    }
  }
}

Node.prototype.appendChild = function(node){
  this.childNodes.push(node);
  node.parentNode = this;
  node.index = this.getIndex(node);
}

Node.prototype.appendAttr = function(node){
  this.attrs.push(node);
}

Node.prototype.dump = function(){
  return {
    type: this.type,
  };
};
