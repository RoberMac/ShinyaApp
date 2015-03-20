angular.module('ShinyaApp.autoscrollDirective' ,[])
.directive('syAutoscroll', function (){
    return {
        restrict: 'A',
        link: function (scope, elem, attrs){
            var mainBox = elem[0]
            elem.bind('scroll', function (){
                if (scope.isBottom() === 0){
                    scope.$apply(function (){
                        scope.isViewMsg = true
                    })
                }
            })
        }
    }
})