module.exports = {
  "presets": [
    ["@babel/preset-env", {
      "targets": {
        "ios": "9",
        "android": "5"
      }
    }],
    ['@babel/preset-react', { runtime: 'automatic' }],
  ],
  "plugins": [
    '@babel/plugin-proposal-class-properties',
    ['@babel/plugin-transform-runtime', {
      regenerator: true,
      helpers: true
    }]
  ]
}
