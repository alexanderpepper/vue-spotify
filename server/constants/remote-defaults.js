module.exports = {
  returns: {arg: 'results', type: 'object'},
  options: {arg: 'options', type: 'object', http: 'optionsFromRequest'},
  method: {
    accepts: [{arg: 'options', type: 'object', http: 'optionsFromRequest'}],
    returns: {arg: 'results', type: 'object'}
  }
}
