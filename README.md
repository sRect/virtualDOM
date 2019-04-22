webpack4.x学习
---
![avatar](https://img.shields.io/badge/webpack-4.29.6-blue.svg)
![avatar](https://img.shields.io/badge/devServer-3.2.1-blue.svg)

### 骨架
```javascript
module.exports = {
  entry: {},
  output: {},
  module: {},
  plugins: [],
  devServer: {},
  mode: "development"
}
```

### 配置scripts脚本
```json
{
  "name": "webpack4.x",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "server": "webpack-dev-server",
    "build": "webpack"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "webpack": "^4.29.6",
    "webpack-cli": "^3.3.0",
  }
}
```

### devServer
```javascript
const path = require('path');

module.exports = {
  entry: {
    main: './src/index.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'dist'),
    port: 3000,
    compress: true,
    hot: true,
    open: true,
    compress: true,
    host: 'localhost'
  },
  mode: "development"
}
```

### html-webpack-plugin
```javascript
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    main: './src/index.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },
  module: {},
  plugins: [
    new HtmlWebpackPlugin({
      title: 'hello world',
      hash: true,
      minify: {
        collapseWhitespace: true,
        removeAttributeQuotes: true
      },
      template: './index.html'
    })
  ],
  devServer: {
    contentBase: path.resolve(__dirname, 'dist'),
    port: 3000,
    compress: true,
    hot: true,
    open: true,
    compress: true,
    host: 'localhost'
  },
  mode: "development"
}
```

