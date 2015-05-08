angular.module('ShinyaApp.usercountDirective', [])
.directive('syUsercount', function (){
    return {
        restrict: 'E',
        template: '<div ng-if="!isMobile" id="userCount" class="faster_animate" ng-click="toggleAtUserBox()">'
                +   '{{\'chat.USER_COUNT\' | translate}}{{userCount}}'
                + '</div>',
        controller: ['$scope', '$timeout', function ($scope, $timeout){
            
            // 在線人數
            $scope.userCount  = 0
            $scope.onlineUser = []
            function userCountNotify(elem, type){
                elem.classList.add(type)
                $timeout(function (){
                    elem.classList.remove(type)
                }, 717)
            }
            // 有用戶加入／退出
            $scope.onUserIO = function(msg){
                var elem = document.getElementById('userCount')
                // 提醒
                elem
                ? $scope.userCount <= msg.count // 桌面端
                    ? userCountNotify(elem, 'user_join')
                    : userCountNotify(elem, 'user_left')
                : null  // 移動端
                // 更新
                $scope.$apply(function (){
                    $scope.userCount  = msg.count
                    $scope.onlineUser = msg.onlineUser
                })
            }
        }]
    }
})