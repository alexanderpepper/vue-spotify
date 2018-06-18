// This is inefficient, but I haven't found require.resolve to be dependable for ssl-config.js
module.exports = (name) => {
  try {
    return require(name)
  }
  catch (e) {
    return false
  }
}
