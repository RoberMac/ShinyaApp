angular.module('ShinyaApp.usercountDirective', [])
.directive('syUsercount', function (){
    return {
        restrict: 'E',
        template: '<div ng-if="!isMobile" id="userCount">'
                +   '在線人數：{{userCount}}'
                + '</div>',
        controller: ['$scope', function ($scope){
            
            // 在線人數
            $scope.userCount = 0
            $scope.onUserIO = function(count){
                $scope.$apply(function (){
                    $scope.userCount = count
                })
            }
        }]
    }
})