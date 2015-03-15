angular.module('ShinyaApp.timeFilter', [])
.filter('sytime', function() {
  return function(input) {
    return input;
  }
})