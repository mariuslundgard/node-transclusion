module.exports = process.env.TRANSCLUSION_COV
  ? require('./lib-cov/transclusion')
  : require('./lib/transclusion');