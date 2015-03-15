angular.module('ShinyaApp.forgotController', [])
.controller('forgotController', ['$scope', '$http', '$timeout', '$location', function($scope, $http, $timeout, $location){

    // init
    $scope.forgot = {}
    $scope.step = 1

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
    $scope.returnToPreviousStep = function (){
        if ($scope.step > 1){
            $scope.step = $scope.step - 1
            $scope.forgot = {}            
        } else {
            $location.path('/')
        }

    }
    $scope.gotoStepThree = function (){
        $scope.step = 3
        $scope.msgNotify('ok', {'msg': '請輸入新密碼'})
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
        console.log($scope.forgot)
        $scope.forgot = {}
    }
}])