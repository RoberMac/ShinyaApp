angular.module('ShinyaApp.notifyDirective', [])
.directive('syNotify', function (){
    return {
        restrict: 'E',
        replace: true,
        template: '<div ng-messages="formMessage.$msg" >'
                +     '<div id="error_msg" class="notification general_animate" ng-message="error_msg">'
                +         '{{errMsg}}'
                +     '</div>'        
                +     '<div id="ok_msg" class="notification general_animate" ng-message="ok_msg">'
                +         '{{okMsg}}'
                +     '</div>'
                + '</div>',
        controller: ['$scope', '$timeout', function($scope, $timeout){
            $scope.formMessage = {
                $msg: {
                    error_msg: '',
                    ok_msg: ''
                }
            }
            $scope.msgNotify = function (type, data){
                if (type === 'error'){
                    $scope.input_shake_animate = true
                    $scope.formMessage.$msg.error_msg = data.msg
                    $scope.errMsg = angular.copy($scope.formMessage.$msg.error_msg)
                    $timeout(function (){
                        $scope.formMessage.$msg.error_msg = ''
                        $scope.input_shake_animate = false
                    }, 1717)
                } else if (type === 'ok'){
                    $scope.formMessage.$msg.ok_msg = data.msg
                    $scope.okMsg = angular.copy($scope.formMessage.$msg.ok_msg)
                    $timeout(function (){
                        $scope.formMessage.$msg.ok_msg = ''
                    }, 1717)   
                } else {
                    console.error('[TypeError]: Not `error` or `ok`')
                }
            }   
        }]
    }
})