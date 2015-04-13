angular.module('ShinyaApp.autoscrollDirective' ,[])
.directive('syAutoscroll', ['syPosHelper', function (syPosHelper){
    return {
        restrict: 'A',
        link: function (scope, elem, attrs){
            var pos = syPosHelper.getNowPos()
            elem.bind('scroll', function (){
                var now_pos = syPosHelper.getNowPos()
                if (now_pos >= pos && syPosHelper.getNowPos() > 0){
                    // Scroll Down
                    scope.isScrollDown = true
                } else {
                    // Scroll Up
                    scope.isScrollDown = false
                }
                pos = now_pos
                if (syPosHelper.isBottom(scope.isScrollDown)){
                    scope.$apply(function (){
                        scope.viewedMsg(2)
                    })
                }
            })
        }
    }
}])