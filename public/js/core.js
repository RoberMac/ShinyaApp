angular.module('ShinyaApp', [
    'ngRoute',
    'ngTouch',
    'ngAnimate',
    'ngMessages',
    'angular-jwt',
    'angular-storage',
    'ShinyaApp.posHelperServices',
    'ShinyaApp.timeHelperServices',
    'ShinyaApp.geoHelperServices',
    'ShinyaApp.msgHelperServices',
    'ShinyaApp.notifyDirective',
    'ShinyaApp.autofocusDirective',
    'ShinyaApp.hideKeyboardDirective',
    'ShinyaApp.imageonloadDirective',
    'ShinyaApp.autoscrollDirective',
    'ShinyaApp.imgDirective',
    'ShinyaApp.beepDirective',
    'ShinyaApp.usercountDirective',
    'ShinyaApp.submitController',
    'ShinyaApp.chatController',
    'ShinyaApp.forgotController',
    'duScroll'
    ])
.config(['$routeProvider', '$locationProvider', '$httpProvider', 'jwtInterceptorProvider', 
    function ($routeProvider, $locationProvider, $httpProvider, jwtInterceptorProvider) {
    // $locationProvider.html5Mode(false).hashPrefix('!')
    $locationProvider.html5Mode(true)
    $routeProvider.
        when('/', {
            templateUrl: '/public/js/templates/submit.html',
            controller: 'submitController'
        }).
        when('/chat', {
            templateUrl: '/public/js/templates/chat.html',
            controller: 'chatController'
        }).
        when('/forgot', {
            templateUrl: '/public/js/templates/forgot.html',
            controller: 'forgotController'
        }).
        otherwise({
            redirectTo: '/'
        })
    jwtInterceptorProvider.tokenGetter = ['store', function(store) {
        return store.get('id_token')
    }]
    $httpProvider.interceptors.push('jwtInterceptor')
}])
.controller('rootController', ['$rootScope', '$scope', '$timeout', '$location', '$route', '$window', 'jwtHelper', 'store', 
    function($rootScope, $scope, $timeout, $location, $route, $window, jwtHelper, store){

    // 檢測是否為手機瀏覽器
    // https://stackoverflow.com/questions/11381673/detecting-a-mobile-browser
    function detectmob() { 
        var ua = $window.navigator.userAgent;
        if(
            ua.match(/Android/i)
            || ua.match(/webOS/i)
            || ua.match(/iPhone/i)
            || ua.match(/iPad/i)
            || ua.match(/iPod/i)
            || ua.match(/BlackBerry/i)
            || ua.match(/Windows Phone/i)
        ){
            return true;
        }
        else {
            return false;
        }
    }
    $rootScope.isMobile = detectmob()

    // 檢測是否為全屏模式
    if (!$window.navigator.standalone && $rootScope.isMobile){
        console.log('no fullscreen mode')
    }

    /* 檢查 token
     *  - 不存在
     *  - 存在，腐爛：觸發提醒（submitController 處理）
     *  - 存在，新鮮：跳轉到 '/chat'
     */
    // 必須 $routeChangeStart 攔截，否則若 token 過期，socket.io 握手不成功
    $scope.$on('$routeChangeStart', function (event, current, pre, next){
        if ($location.path() === '/'){
            if (store.get('id_token')){
                if (!jwtHelper.isTokenExpired(store.get('id_token'))){
                    $location.path('/chat').replace()
                }
            }
        } else if ($location.path() === '/chat'){
            if(!store.get('id_token')){
                $location.path('/').replace()
            } else {
                if (jwtHelper.isTokenExpired(store.get('id_token'))){
                    $location.path('/').replace()
                }
            }
        }
    })
    // 監聽開啟／關閉「位置服務」
    $scope.$on('preTurnOnGeoServices', function (msg){
        $timeout(function (){
            $scope.$broadcast('turnOnGeoServices', msg)
        }, 100)
    })
    $scope.$on('preTurnOffGeoServices', function (msg){
        $timeout(function (){
            $scope.$broadcast('turnOffGeoServices', msg)
        }, 100)
    })
}])