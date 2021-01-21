const removePlugin = require('./lib/remove')
const importPlugin = require('./lib/import')
const presets = ['@babel/preset-env', '@babel/preset-react']
const plugins = [
  [
    importPlugin,
    {
      libraryName: 'antd',
      libraryDirectory: 'lib',
      transformToDefaultImport: true,
      style: true,
    },
  ],
  [
    removePlugin,
    {
      ignore: ['warn'],
    },
  ],
]

module.exports = { presets, plugins }
