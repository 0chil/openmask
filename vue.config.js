var fs = require('fs');
module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
  outputDir:'docs',
  publicPath:'',
  devServer:{
    https:true,
    host:'0.0.0.0',
    disableHostCheck: true,
    port:8080,
  },
}