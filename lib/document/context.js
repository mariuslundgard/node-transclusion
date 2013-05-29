/*!
 * Transclusion - Parser
 * Copyright(c) 2013 Marius Lundgård <marius.lundgard@gmail.com>
 * MIT Licensed
 */

/**
 * Initialize `Context` with the given `document`.
 *
 * Options:
 *
 *   - `colons` allow colons for attr delimiters
 *
 * @param {Document} document
 * @param {Object} options
 * @api private
 */

var Context = module.exports = function Context(document) {
  this.document = document;
  for (var i in document.data) {
    this[i] = document.data[i];
  }
};
