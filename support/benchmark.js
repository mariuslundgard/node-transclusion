
/**
 * Module dependencies.
 */

var uubench = require('uubench')
  , transclusion = require('../');


var suite = new uubench.Suite({
  min: 200,
  start: function() {
    console.log("starting...");
  },
  result: function(name, stats){
    console.log(name + ": " + stats.iterations/stats.elapsed);
    // var persec = 1000 / stats.elapsed
    //   , ops = stats.iterations * persec;
    // console.log(' —› %s: %d', name, ops | 0);
  },
  done: function() {
    console.log("finished");
  }
});

function setup(self) {
  var suffix = self ? ' (self)' : ''
    , options = { self: self };

  // Tiny
  var str = '<body>test</body>'
    , fn = transclusion.compile(str, options);

  suite.bench('tiny' + suffix, function(next){
    fn();
    next();
  });

  // Small
  str = '<head></head><body></body>';

  var fn2 = transclusion.compile(str, options);

  suite.bench('small' + suffix, function(next){
    fn2();
    next();
  });

  // Small locals
  str = '<head></head><body></body>';

  if (self) {
    str = '<head></head><body></body>';
  }

  var fn3 = transclusion.compile(str, options);

  suite.bench('small locals' + suffix, function(next){
    fn3({ title: 'Title', links: ['Home', 'About Us', 'Store', 'FAQ', 'Contact'] });
    next();
  });

  // Medium
  str = '<head></head><body></body>';

  str = Array(30).join(str);
  var fn4 = transclusion.compile(str, options);

  suite.bench('medium' + suffix, function(next){
    fn4();
    next();
  });

  // Large
  str = '<html>'+"\n"
  str += '  <head>'+"\n"
  str += '    <title>Large &mdash; Transclusion Benchmarks</title>'+"\n"
  str += '  </head>'+"\n"
  str += '  <body>'+"\n"
  str += '    <p>laksm dlkam;dlk mas;kld ma;kldm ;klasmd lkasm;damsdkan ;fjnanfiabsdoab fuabshdb ahjsdb ahbsdkhab oushbd uahbsdo uabsduhb ahsdb absdkahjsbdkab sdkjab ksjhdbakhsbfuhbauhsfb ahbshabdkhab skjdhb akhjsdbk ahjsbdkjabs dkhaskjhdb ahjsdkas dkahsdkjhab kdhbka dhb</p>'+"\n"
  str += '  </body>'+"\n"
  str += '</html>';

  str = Array(100).join(str);
  var fn5 = transclusion.compile(str, options);

  suite.bench('large' + suffix, function(next){
    fn5();
    next();
  });
}

setup();
setup(true);

suite.run();
