/*!
 * Transclusion
 * Copyright(c) 2010 Marius Lundgård <marius.lundgard@gmail.com>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var Parser = require('./document/parser')
  , Lexer = require('./document/lexer')
  , Compiler = require('./document/compiler')
  , Document = require('./document/document')
  , Archive = require('./archive')
  , runtime = require('./runtime')
  , fs = require('fs');

/**
 * Library version.
 */

exports.version = '0.0.1';

/**
 * Expose `Compiler`.
 */

exports.Compiler = Compiler;

/**
 * Expose `Parser`.
 */

exports.Parser = Parser;

/**
 * Expose `Lexer`.
 */

exports.Lexer = Lexer;

/**
 * Expose `Document`.
 */

exports.Document = Document;

/**
 * Expose `Archive`.
 */

exports.Archive = Archive;

/**
 * Transclusion runtime helpers.
 */

exports.runtime = runtime;

/**
 * Template function cache.
 */

exports.cache = {};

/**
 * Parse the given `str` of transclusion and return a function body.
 *
 * @param {String} str
 * @param {Object} options
 * @return {String}
 * @api private
 */

function parse(str, options){

  try {
    // Parse
    var parser = new (options.parser || Parser)(str, options.filename, options);

    // Compile
    var compiler = new (options.compiler || Compiler)(parser.parse(), options)
      , js = compiler.compile();

    return ''
      + 'var buf = [];\n'
      + (options.self
        ? 'var self = locals || {};\n' + js
        : 'with (locals || {}) {\n' + js + '\n}\n')
      + 'return buf.join("");';

  } catch (err) {
    parser = parser.context();
    runtime.rethrow(err, parser.filename, parser.lexer.stream.line);
  }
}

/**
 * Compile a `Function` representation of the given transclusion `str`.
 *
 * Options:
 *
 *   - `compileDebug` when `false` debugging code is stripped from the compiled template
 *   - `filename` used to improve errors when `compileDebug` is not `false`
 *
 * @param {String} str
 * @param {Options} options
 * @return {Function}
 * @api public
 */

exports.compile = function(str, options){
  var options = options || {}
    , filename = options.filename
      ? JSON.stringify(options.filename)
      : 'undefined'
    , fn;

  if (options.compileDebug !== false) {
    fn = [
        'transclusion.debug = [{ lineno: 1, filename: ' + filename + ' }];'
      , 'try {'
      , parse(str, options)
      , '} catch (err) {'
      , '  transclusion.rethrow(err, transclusion.debug[0].filename, transclusion.debug[0].lineno);'
      , '}'
    ].join('\n');
  } else {
    fn = parse(str, options);
  }

  if (options.client) return new Function('locals', fn)
  fn = new Function('locals, transclusion', fn)
  return function(locals){ return fn(locals, Object.create(runtime)) }
};

/**
 * Render the given `str` of transclusion and invoke
 * the callback `fn(err, str)`.
 *
 * Options:
 *
 *   - `cache` enable template caching
 *   - `filename` filename required for `include` / `extends` and caching
 *
 * @param {String} str
 * @param {Object|Function} options or fn
 * @param {Function} fn
 * @api public
 */

exports.render = function(str, options, fn){
  // swap args
  if ('function' == typeof options) {
    fn = options, options = {};
  }

  // cache requires .filename
  if (options.cache && !options.filename) {
    return fn(new Error('the "filename" option is required for caching'));
  }

  try {
    var path = options.filename;
    var tmpl = options.cache
      ? exports.cache[path] || (exports.cache[path] = exports.compile(str, options))
      : exports.compile(str, options);
    fn(null, tmpl(options));
  } catch (err) {
    fn(err);
  }
};

/**
 * Render a Transclusion file at the given `path` and callback `fn(err, str)`.
 *
 * @param {String} path
 * @param {Object|Function} options or callback
 * @param {Function} fn
 * @api public
 */

exports.renderFile = function(path, options, fn){
  var key = path + ':string';

  if ('function' == typeof options) {
    fn = options, options = {};
  }

  try {
    options.filename = path;
    var str = options.cache
      ? exports.cache[key] || (exports.cache[key] = fs.readFileSync(path, 'utf8'))
      : fs.readFileSync(path, 'utf8');
    exports.render(str, options, fn);
  } catch (err) {
    fn(err);
  }
};

/**
 * Express support.
 */

exports.__express = exports.renderFile;
