'use strict';
var ga = require('./ga');

var GoogleAnalytics = (function() {
  return {
    trackPageview: function() {
      ga('send', 'pageview');
    }
  }
})()
module.exports = GoogleAnalytics;
