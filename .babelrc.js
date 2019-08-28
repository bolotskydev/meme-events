module.exports = {
  comments: false,
  presets: [
    [
      '@babel/preset-env',
      {
        targets: '> 0.25%, not dead',
        useBuiltIns: 'entry',
        corejs: 3,
      },
    ],
    ['minify'],
  ],
  plugins: ['add-module-exports', '@babel/plugin-transform-runtime'],
}
