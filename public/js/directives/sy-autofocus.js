angular.module('ShinyaApp.autofocusDirective', [])
.directive('syAutofocus', ['$rootScope', '$timeout', function ($rootScope, $timeout){
    return {
        restrict: 'A',
        link: function (scope, elem, attr){
            if (!$rootScope.isMobile){
                $timeout(function (){
                    elem[0].focus()
                })
            }
        }
    }
}])