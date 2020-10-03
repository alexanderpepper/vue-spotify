module.exports = {
  // transpileDependencies: [
  //   'vuetify'
  // ],
  devServer: { headers: { 'Cache-Control': 'no-store' } },
  chainWebpack: (config) => {
    if (process.env.NODE_ENV === 'development') {
      config.plugins.delete('preload')
    }
  }
}
