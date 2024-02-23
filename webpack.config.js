module.exports = {
  renderer: {
    entry: './dist/renderer/javascripts/index.js',
  },
  preload: {
    entry: './dist/preload/index.js',
  },
  main: {
    entry: './dist/main/index.js',
    module: {
      rules: [
        {
          test: /\.(png|jpe?g|gif)$/i,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[path][name].[ext]',
              },
            },
          ],
        },
      ],
    },
  },
};
