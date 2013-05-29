
/**
 * Module dependencies.
 */

var fs = require('fs')
  , pathinfo = require('./pathinfo')
  , Document = require('./document/document');

module.exports = Archive;

function Archive(path, options) {
  this.path = path;
  this.options = options || {};
}

/**
 * Locate a document in the archive by the given `options`
 *
 * @param {Object} options
 * @param {Function} fn
 * @return void
 * @api private
 */

Archive.prototype.locateDocument = function(options, fn){
  if (options.uri) {
    var archive = this;
    fs.readdir(this.path, function(err, files){

       for (var i = 0; i < files.length; i++) {
          var info = pathinfo(archive.path+'/'+files[i]);
          if (info.uriname == options.uri) {
            fn(null, new Document(info.path, {data: info}));
            return;
          }
       }

       // error: could not locate
       fn(new Error('Could not find a document matching the URI: '+options.uri), null);
    });
    return;
  }

  // error: insufficient parameters
  fn(new Error('Could not locate a document using the provided parameters'), null);
};
