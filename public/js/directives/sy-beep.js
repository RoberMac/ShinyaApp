angular.module('ShinyaApp.beepDirective', [])
.directive('syBeep', ['$timeout', 'syPosHelper', function ($timeout, syPosHelper){
    return {
        restrict: 'E',
        replace : true,
        template: '<div class="all_notify_box general_animate" ng-if="!isViewMsg" id="notify_box">'
                +   '<span ng-click="viewedMsg(1)">{{msgNotifyBox.msg}}</span>'
                +   '<audio ng-if="!isMuted" autoplay>'
                +       '<source src="public/sound/beep.ogg" type="audio/ogg">'
                +       '<source src="public/sound/beep.m4a" type="audio/x-m4a">'
                +   '</audio>'
                +   '<audio ng-if="isMuted" autoplay muted>'
                +       '<source src="public/sound/beep.ogg" type="audio/ogg">'
                +       '<source src="public/sound/beep.m4a" type="audio/x-m4a">'
                +   '</audio>'
                + '</div>',
        controller: ['$scope', function ($scope){
            /*
             * 新消息抵達提醒
             *      `$scope.isViewMsg`：新消息是否已閱
             *      `$scope.msgNotifyBox`：提醒消息的內容
             *      `$scope.isAtMsg`：判斷是否為提到（@）你的信息
             *      `$scope.contentItem`：存儲提到（@）你的消息 id
             */
            $scope.isViewMsg = true
            $scope.msgNotifyBox = {}
            $scope.contentItem = 0
            /* 滾動到消息位置後改變消息樣式 */
            $scope.isAtMsgShow = false
            function atMsg(id){
                $scope.isAtMsgShow = true
                var elem = document.getElementById(id).querySelector('.content_box')
                elem.classList.add('atMsg')
                $timeout(function (){
                    elem.classList.remove('atMsg')
                    $timeout(function (){
                        $scope.isAtMsgShow = false
                    }, 717)
                }, 717)
            }
            function scrollToSpecPos(){
                $scope.isViewMsg = true
                if ($scope.contentItem){
                    // 有用戶提到（@）你，滾動到相應位置
                    var pos = syPosHelper.getElemTopPos($scope.contentItem)
                    syPosHelper.scrollToPos(pos || null, $scope.isScrollDown)
                    atMsg($scope.contentItem)
                    $scope.contentItem = 0
                } else {
                    // 新消息，滾動到底部
                    syPosHelper.scrollToPos(null, $scope.isScrollDown)
                }   
            }
            $scope.viewedMsg = function (type){
                // 當前不處於 chat_box，切換到 chat_box 後滾動
                if (!$scope.isChatBox){
                    if (!$scope.isChatBox){
                        // 從 `geo_box` / `news_box` 返回 `chat_box` 時，重置 `user_info_box`
                        $scope.toggleCurrentPage('infoBox')
                    }
                    $scope.isChatBox = !$scope.isChatBox
                    $timeout(function (){
                        scrollToSpecPos()
                    })
                } else {
                    if (type === 1){
                        $scope.isZoomIn = false
                        // 滾動並抹除提醒
                        scrollToSpecPos()
                    } else if (type === 2){
                        // 不滾動，只抹除提醒
                        $scope.isViewMsg = true
                    }
                }

            }
            $scope.newMsgNotify = function(type, msg, pos){
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
                        $scope.contentItem = pos
                        $scope.isViewMsg = false
                    }
                })
            }
        }]
    }
}])