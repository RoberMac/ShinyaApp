angular.module('ShinyaApp.beepDirective', [])
.directive('syBeep', function (){
    return {
        restrict: 'E',
        replace : true,
        template: '<div ng-if="!isViewMsg" ng-click="viewedMsg()" id="notify_box">'
                +   '{{msgNotifyBox.msg}}'
                +   '<audio autoplay>'
                +       '<source src="public/sound/beep.ogg" type="audio/ogg">'
                +       '<source src="public/sound/beep.m4a" type="audio/x-m4a">'
                +   '</audio>'
                + '</div>',
        controller: ['$scope', function ($scope){
            /*
             * 新消息抵達提醒
             *
             */
            $scope.isViewMsg = true
            $scope.msgNotifyBox = {}
            $scope.viewedMsg = function (){
                $scope.isViewMsg = true
                $scope.scrollToBottom()
            }
            $scope.msgNotify = function(type, msg){
                $scope.$apply(function (){
                    if (type === 'newMsg'){
                        $scope.msgNotifyBox = {
                            'type': 'newMsg',
                            'msg' : msg
                        }
                        $scope.isViewMsg = false
                    }
                })
            }
        }]
    }
})