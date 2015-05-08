angular.module('ShinyaApp.submitController', [])
.controller('submitController', [
        '$scope', '$rootScope', '$http',
        '$timeout', '$location', '$route',
        '$window', 'jwtHelper', 'store', '$translate',
    function ($scope, $rootScope, $http, $timeout, $location, $route, $window, jwtHelper, store, $translate){

    $rootScope.isSubmit = true
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
    $scope.msgNotify = function (type, msg){
        if (type === 'error'){
            $scope.input_shake_animate = true
            $scope.errMsg = $translate.instant(msg)
            $scope.isMsgNotify = true
            $timeout(function (){
                $scope.errMsg = ''
                $scope.input_shake_animate = false
                $scope.isMsgNotify = false
            }, 1717)
        } else if (type === 'ok'){
            $scope.okMsg = $translate.instant(msg)
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
     * 驗證相關
     **********
     */
    // token 腐爛，觸發提醒
    if (!!store.get('id_token')){
        if (jwtHelper.isTokenExpired(store.get('id_token'))){
            // 此時 $scope.msgNotify 方法還沒定義
            $timeout(function (){
                $scope.msgNotify('ok', $translate.instant('ok.RELOGIN'))
            }, 0)
        }
    }
    // 監聽開啟／關閉「位置服務」
    $scope.$on('turnOnGeoServices', function (e, msg){
        $timeout(function (){
            $scope.msgNotify('ok', msg)
        }, 0)
    })
    $scope.$on('turnOffGeoServices', function (e, msg){
        $timeout(function (){
            $scope.msgNotify('ok', msg)
        }, 0)
    })
    /*
     **********
     * i18n
     **********
     */
    $scope.isShowLoadAnimate = false
    $scope.$on('$translateChangeBeforeStart', function (){
        $scope.isShowLoadAnimate = true
    })
    $rootScope.$on('$translateChangeSuccess', function (){
        $route.reload()
    })
    /*
     **********
     * 頁面切換
     **********
     */
    $scope.isLogin = true;
    $scope.toggleSubmit = function (){
        $scope.isLogin = !$scope.isLogin
    }
    /*
     ************
     * 登陸／註冊
     ************
     *
     *  `$scope.login`：緩存登陸信息
     *  `$scope.register`：緩存註冊信息
     *  `$scope.loginSubmit`：處理登陸
     *  `$scope.registerSubmit`：處理註冊
     *
     */
    $scope.login = {}
    $scope.register = {}
    $scope.loginSubmit = function (){

        $http.
        post('/login', {
            "user": $scope.login.user,
            "password": $scope.login.password
        }).
        success(function (data, status, headers, config){
            store.set('id_token', data.token)
            $location.path('/chat').replace()
        }).
        error(function (data, status, headers, config){
            $scope.msgNotify('error', data.msg)
        })
        $scope.login = {}
    }
    $scope.registerSubmit = function (){
        $http.
        post('/register', {
            "username": $scope.register.username,
            "email": angular.lowercase($scope.register.email), 
            "password": $scope.register.password
        }).
        success(function (data, status, headers, config){
            $scope.msgNotify('ok', data.msg)
            // switch to [login]
            $scope.toggleSubmit()
        }).
        error(function (data, status, headers, config){
            $scope.msgNotify('error', data.msg)
        })
        $scope.register = {}
    }
}])
