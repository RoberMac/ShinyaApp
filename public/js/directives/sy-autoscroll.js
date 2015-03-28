angular.module('ShinyaApp.autoscrollDirective' ,[])
.directive('syAutoscroll', ['syPosHelper', function (syPosHelper){
    return {
        restrict: 'A',
        link: function (scope, elem, attrs){
            elem.bind('scroll', function (){
                if (syPosHelper.isBottom()){
                    scope.$apply(function (){
                        scope.isViewMsg = true
                    })
                }
            })
        }
    }
}])