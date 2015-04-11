// via http://stackoverflow.com/a/17884754/3786947
angular.module('ShinyaApp.imageonloadDirective', [])
.directive('syImageonload', function ($rootScope, $timeout){
    return {
        restrict: 'A',
        link: function(scope, elem, attr) {
            elem.toggleClass('loding')
            elem.bind('load', function() {
                elem.toggleClass('loding')
                scope.$apply(function (){
                    scope.isImageLoaded = true
                })
            })
        }
    }
})