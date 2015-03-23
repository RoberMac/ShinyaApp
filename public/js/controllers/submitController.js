angular.module('ShinyaApp.submitController', [])
.controller('submitController', ['$scope', '$http', '$timeout', '$location', '$route', '$window', 'jwtHelper', 'store',
    function ($scope, $http, $timeout, $location, $route, $window, jwtHelper, store){

    // init
    $scope.login = {}
    $scope.register = {}

    // token 腐爛，觸發提醒
    if (!!store.get('id_token')){
        if (jwtHelper.isTokenExpired(store.get('id_token'))){
            // 此時 $scope.msgNotify 方法還沒定義
            $timeout(function (){
                $scope.msgNotify('ok', {'msg': '請重新登錄'})
            }, 0)
        }
    }
    // 監聽開啟／關閉「位置服務」
    $scope.$on('turnOnGeoServices', function (msg){
        $timeout(function (){
            $scope.msgNotify('ok', {'msg': '驗證身份以開啟服務'})
        }, 0)
    })
    $scope.$on('turnOffGeoServices', function (msg){
        $timeout(function (){
            $scope.msgNotify('ok', {'msg': '驗證身份以取消服務'})
        }, 0)
    })

    // ngSwitch
    $scope.isLogin = true;
    $scope.toggleSubmit = function (){
        $scope.isLogin = !$scope.isLogin
    }

    // handle login or register submit
    $scope.loginSubmit = function (){

        $http.
        post('/login', {
            "user": $scope.login.user,
            "password": $scope.login.password
        }).
        success(function (data, status, headers, config){
            store.set('id_token', data.token)
            $location.path('/chat')
        }).
        error(function (data, status, headers, config){
            $scope.msgNotify('error', data)
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
            $scope.msgNotify('ok', data)
            // switch to [login]
            $scope.toggleSubmit()
        }).
        error(function (data, status, headers, config){
            $scope.msgNotify('error', data)
        })
        $scope.register = {}
        $scope.msgNotify('ok', {'msg': '請稍候'})
    }
}])
