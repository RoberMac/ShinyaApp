angular.module('ShinyaApp.hideKeyboardDirective', [])
.directive('syHideKeyboard', ['$rootScope', function ($rootScope){
    return {
        restrict: 'A',
        link: function (scope, elem, attr){
            var inputElem = elem.find('input');
            if ($rootScope.isMobile){
                elem.bind('submit', function (){
                    inputElem[0].blur()
                })
            }
        }
    }
}])