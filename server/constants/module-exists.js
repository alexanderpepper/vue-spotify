module.exports = (name) => {
  try {
    return require.resolve(name)
  }
  catch (e) {
    return false
  }
}
