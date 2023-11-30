const CopyPlugin = require('copy-webpack-plugin');

module.exports = function override(config, env) {
  if (!config.plugins) {
    config.plugins = [];
  }

  config.plugins.push(
    new CopyPlugin({
      patterns: [
        { from: 'fixtures', to: 'fixtures' },
      ],
    })
  );

  return config;
};
