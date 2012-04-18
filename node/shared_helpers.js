var sharedHelpers = {}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = sharedHelpers;
  _ = require('underscore');
  charlotte = require('charlotte');
}


sharedHelpers.static = { 
  // put static helpers here
};

sharedHelpers.dynamic = {
  messages: function(req, res) {
    return req.flash() || {};
  },
  
  referer: function(req, res) {
    return req.referer;
  }
};

_.each(['pageStylesheets', 'pageScripts', 'navBar', 'cancelLink', 'modalForm'], function(p) {
  sharedHelpers.dynamic[p] = charlotte.util.propertyHelper();
});
