'use strict'

module.exports = function(Container) {
  Container.settings.acls = require('./default-acl.json').accessControlList
};