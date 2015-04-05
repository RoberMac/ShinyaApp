angular.module('ShinyaApp.usercountDirective', [])
.directive('syUsercount', function (){
    return {
        restrict: 'E',
        template: '<div ng-if="!isMobile" id="userCount">'
                +   '在線人數：{{userCount}}'
                + '</div>',
        controller: ['$scope', function ($scope){
            
            // 在線人數
            $scope.userCount  = 0
            $scope.onlineUser = []
            $scope.onUserIO = function(msg){
                $scope.$apply(function (){
                    $scope.userCount  = msg.count
                    $scope.onlineUser = msg.onlineUser
                })
            }
        }]
    }
})