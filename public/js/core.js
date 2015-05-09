angular.module('ShinyaApp', [
    'ngRoute',
    'ngTouch',
    'ngAnimate',
    'angular-jwt',
    'angular-storage',
    'duScroll',
    'pascalprecht.translate',
    'ShinyaApp.posHelperServices',
    'ShinyaApp.timeHelperServices',
    'ShinyaApp.geoHelperServices',
    'ShinyaApp.msgHelperServices',
    'ShinyaApp.logoDirective',
    'ShinyaApp.notifyDirective',
    'ShinyaApp.autofocusDirective',
    'ShinyaApp.hideKeyboardDirective',
    'ShinyaApp.imageonloadDirective',
    'ShinyaApp.autoscrollDirective',
    'ShinyaApp.imgDirective',
    'ShinyaApp.beepDirective',
    'ShinyaApp.usercountDirective',
    'ShinyaApp.i18nDirective',
    'ShinyaApp.submitController',
    'ShinyaApp.chatController',
    'ShinyaApp.forgotController'
    ])
.config(['$routeProvider', '$locationProvider', '$httpProvider', 'jwtInterceptorProvider', '$translateProvider', 
    function ($routeProvider, $locationProvider, $httpProvider, jwtInterceptorProvider, $translateProvider) {
    // $locationProvider.html5Mode(false).hashPrefix('!')
    $locationProvider.html5Mode(true)
    // 路由
    $routeProvider.
        when('/', {
            templateUrl: '/public/dist/submit.min.html',
            controller: 'submitController'
        }).
        when('/chat', {
            templateUrl: '/public/dist/chat.min.html',
            controller: 'chatController'
        }).
        when('/forgot', {
            templateUrl: '/public/dist/forgot.min.html',
            controller: 'forgotController'
        }).
        otherwise({
            redirectTo: '/'
        })
    // 配置每次請求攜帶 JWT
    jwtInterceptorProvider.tokenGetter = ['store', function(store) {
        return store.get('id_token')
    }]
    $httpProvider.interceptors.push('jwtInterceptor')
    // i18n
    $translateProvider
    .useStaticFilesLoader({
        'prefix': '/public/i18n/i18n-',
        'suffix': '.json'
    })
    .preferredLanguage('zh-HK')
    .useStorage('a0-angular-storage')
}])
.factory('a0-angular-storage', ['store', function(store){
    return {
        put: function (key, value){
            store.set(key, value)
        },
        get: function (key){
            return store.get(key)
        }
    }
}])
.controller('rootController', ['$rootScope', '$scope', '$timeout', '$location', '$route', '$window', 'jwtHelper', 'store', 
    function($rootScope, $scope, $timeout, $location, $route, $window, jwtHelper, store){
    
    $scope.isLogoLoaded = false
    $rootScope.isSubmit = true
    // 存儲註銷用戶前的信息
    // index:
    //     0: 上次註銷用戶名
    //     1: 登陸後的「下一步動作」
    $rootScope.lastInfo = []
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
        // TODO
    }

    /* 檢查 token
     *  - 不存在
     *  - 存在，腐爛：觸發提醒（submitController 處理）
     *  - 存在，新鮮：跳轉到 '/chat'
     */
    // 必須 $routeChangeStart 攔截，否則若 token 過期，socket.io 握手不成功
    $scope.$on('$routeChangeStart', function (event, current, pre, next){
        var token = store.get('id_token')
        if ($location.path() === '/'){
            token
            ? !jwtHelper.isTokenExpired(token)
                ? $location.path('/chat').replace()
                : null
            : null
        } else if ($location.path() === '/chat'){
            !token || jwtHelper.isTokenExpired(token)
            ? $location.path('/').replace()
            : null
        }
    })
}])