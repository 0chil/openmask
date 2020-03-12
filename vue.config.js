var fs = require('fs');
module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
  devServer:{
    https:true,
    host:'0.0.0.0',
    disableHostCheck: true,
    port:8080,
  },
}