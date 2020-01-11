module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
    'plugins': [], // 'js-logger'
    'env': {
        'production': {
            'plugins': ['transform-remove-console']
        }
    }
}
