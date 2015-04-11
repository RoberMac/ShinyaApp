// via http://stackoverflow.com/a/17884754/3786947
angular.module('ShinyaApp.imageonloadDirective', [])
.directive('syImageonload', function ($rootScope, $timeout){
    return {
        restrict: 'A',
        link: function(scope, elem, attr) {
            elem.bind('load', function() {
                scope.$apply(function (){
                    scope.isImageLoaded = true
                })
            })
        }
    }
})