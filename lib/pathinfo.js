
/**
 * Module dependencies.
 */

var sanitize = require('validator').sanitize;

/**
 * Returns path info of a given `path`
 */
module.exports = function (path) {
  var tmp = path.split('/');
  var basename = tmp.pop();
  var dirname = tmp.join('/');

  tmp = basename.split('.');
  var extension = tmp.length ? tmp.pop() : null;
  var filename = tmp.join('.');

  var uriname = sanitize(filename)
    .trim()
    .toLowerCase();

  return {
    path: dirname + '/' + basename,
    dirname: dirname,
    basename: basename,
    filename: filename,
    extension: extension,
    uriname: uriname
  };
};