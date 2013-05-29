
/*!
 * Transclusion - states
 * Copyright(c) 2013 Marius Lundgård <marius.lundgard@gmail.com>
 * MIT Licensed
 */

exports.get = function(lexer, stateName){
  var State = require('./'+stateName)
  return new State(lexer);
}
