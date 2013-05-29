
/*!
 * Transclusion - nodes
 * Copyright(c) 2013 Marius Lundgård <marius.lundgard@gmail.com>
 * MIT Licensed
 */

exports.get = function(tree_builder, modeName){
  var Mode = require('./'+modeName)
  return new Mode(tree_builder);
}
