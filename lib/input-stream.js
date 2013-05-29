/*!
 * Transclusion - InputStream
 * Copyright(c) 2013 Marius Lundgård <marius.lundgard@gmail.com>
 * MIT Licensed
 */

/**
 * Initialize `InputStream` with the given `node`.
 */

var InputStream = module.exports = function InputStream(input, options) {
  this.options = options = options || {};
  this.input = input;
  this.cursor = -1;
  this.line = 1;
  this.end = this.input.length;
};

/**
 * InputStream prototype.
 */

InputStream.prototype = {

  consume: function(n){
    this.cursor = this.cursor + (n ? n : 1);

    if (this.cursor < this.end) {
      var code = this.input[this.cursor];
      if ("\n" == code) this.line++;
      return code;
    }

    return -1;
  },

  reconsume: function(){
    this.cursor--;
  },

  next: function(n){
    return this.input[this.cursor + (n || 1)];
  }
};
