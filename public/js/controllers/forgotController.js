angular.module('ShinyaApp.forgotController', [])
.controller('forgotController', ['$scope', '$http', '$timeout', '$location', function($scope, $http, $timeout, $location){
    /*
     **********
     * 消息提醒
     **********
     *
     *  `$scope.isMsgNotify`：是否為消息提醒
     *  `$scope.errMsg`：錯誤消息
     *  `$scope.okMsg`：成功消息
     *  `$scope.msgNotify`：觸發消息提醒
     *
     */
    $scope.isMsgNotify = false
    $scope.errMsg = ''
    $scope.okMsg = ''
    $scope.msgNotify = function (type, data){
        if (type === 'error'){
            $scope.input_shake_animate = true
            $scope.errMsg = data.msg
            $scope.isMsgNotify = true
            $timeout(function (){
                $scope.errMsg = ''
                $scope.input_shake_animate = false
                $scope.isMsgNotify = false
            }, 1717)
        } else if (type === 'ok'){
            $scope.okMsg = data.msg
            $scope.isMsgNotify = true
            $timeout(function (){
                $scope.okMsg = ''
                $scope.isMsgNotify = false
            }, 1717)
        } else {
            console.error('[TypeError]: Not `error` or `ok`')
        }
    }
    /*
     **********
     * 忘記密碼
     **********
     *  `$scope.forgot`：存儲用戶需提交的信息
     *  `$scope.step`：當前處於第幾步
     *  `$scope.returnToPreviousStep`：返回上一步
     *  `$scope.gotoStepThree`：跳轉到第三步
     *  `$scope.forgotEmailSubmit`：提交「電郵地址」
     *  `$scope.forgotCodeSubmit`：提交「驗證碼」和「新密碼」
     */
    $scope.forgot = {}
    $scope.step = 1
    $scope.returnToPreviousStep = function (){
        if ($scope.step === 1){
            $location.path('/')
        } else {
            $scope.step = $scope.step - 1
        }
    }
    $scope.gotoStepThree = function (){
        $scope.step = 3
        $scope.msgNotify('ok', {'msg': '請輸入新密碼'})
    }
    $scope.forgotEmailSubmit = function (){

        $http.
        post('/forgot_email', {
            "email": $scope.forgot.email
        }).
        success(function (data, status, headers, config){
            $scope.step = 2
            $scope.msgNotify('ok', data)
        }).
        error(function (data, status, headers, config){
            $scope.msgNotify('error', data)
        })
        $scope.forgot = {}
    }
    $scope.forgotCodeSubmit = function (){

        $http.
        post('/forgot_code', {
            'code': $scope.forgot.code,
            'password': $scope.forgot.password
        }).
        success(function (data, status, headers, config){
            $scope.msgNotify('ok', data)
            $timeout(function (){
                $location.path('/')
            }, 2000)
        }).
        error(function (data, status, headers, config){
            $scope.msgNotify('error', data)
        })
        $scope.forgot = {}
    }
}])