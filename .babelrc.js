const removePlugin = require('./lib/remove')
const presets = ['@babel/preset-env']
const plugins = [
  [
    removePlugin,
    {
      ignore: ['warn'],
    },
  ],
]

module.exports = { presets, plugins }
