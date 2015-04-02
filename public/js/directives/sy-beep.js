angular.module('ShinyaApp.beepDirective', [])
.directive('syBeep', ['$timeout', 'syPosHelper', function ($timeout, syPosHelper){
    return {
        restrict: 'E',
        replace : true,
        template: '<div class="all_notify_box general_animate" ng-if="!isViewMsg" id="notify_box">'
                +   '<span ng-click="viewedMsg(1)">{{msgNotifyBox.msg}}</span>'
                +   '<audio autoplay>'
                +       '<source src="public/sound/beep.ogg" type="audio/ogg">'
                +       '<source src="public/sound/beep.m4a" type="audio/x-m4a">'
                +   '</audio>'
                + '</div>',
        controller: ['$scope', function ($scope){
            /*
             * 新消息抵達提醒
             *      `$scope.isViewMsg`：新消息是否已閱
             */
            $scope.isViewMsg = true
            $scope.msgNotifyBox = {}
            $scope.contentItemPos = 0
            $scope.viewedMsg = function (type){
                // 當前不處於 chat_box，切換到 chat_box 後滾動
                if (!$scope.isChatBox){
                    $scope.isChatBox = !$scope.isChatBox
                    $timeout(function (){
                        $scope.isViewMsg = true
                        syPosHelper.scrollToPos()
                    })
                } else {
                    // 1: Scroll, 2: Don't Scroll
                    if (type === 1){
                        $scope.isViewMsg = true
                        syPosHelper.scrollToPos($scope.contentItemPos || null)
                        $scope.contentItemPos = 0
                    } else if (type === 2){
                        $scope.isViewMsg = true
                    }
                }

            }
            $scope.msgNotify = function(type, msg, pos){
                $scope.$apply(function (){
                    if (type === 'newMsg'){
                        $scope.msgNotifyBox = {
                            'type': 'newMsg',
                            'msg' : msg
                        }
                        $scope.isViewMsg = false
                    } else if (type === 'atMsg'){
                        $scope.msgNotifyBox = {
                            'type': 'atMsg',
                            'msg' : '@' + msg + ' 提到了你'
                        }
                        $scope.contentItemPos = pos
                        $scope.isViewMsg = false
                    }
                })
            }
        }]
    }
}])