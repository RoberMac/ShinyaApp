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
    .translations('en', {
        'login': {
            'TITLE': 'Log In',
            'USERNAME': 'Username / Email',
            'FORGOT_TITLE': 'Forgot Password',
            'SUBMIT_TITLE': 'Log In'
        },
        'register': {
            'TITLE': 'Sign Up',
            'USERNAME': 'Username',
            'SUBMIT_TITLE': 'Sign Up'
        },
        'general': {
            'EMAIL': 'Email',
            'PASSWORD': 'Password',
        },
        'forgot': {
            'TITLE': 'Find Your Account',
            'NEW_PASSWORD': 'New Password',
            'CODE': 'Verification Code',
            'NEXT_STEP': 'Next Step',
        },
        'chat': {
            'USER_COUNT': 'Online User: ',
            'JOINED': 'Joined',
            'NUMERO_PREFIX': 'No. ',
            'NUMERO_SUBFFIX': '',
            'DATE_FORMAT': 'MM/dd/yyyy',
            'TIME_FORMAT': 'HH:mm:ss',
            'SOUND': 'Sound',
            'LOCATION': 'Location',
            'LOCATION_SERVICES': 'Location Services',
            'VERSION': 'Version',
            'LOG_OUT': 'Log Out',
            'VIEW_ORIGINAL': 'View Original',
            'NEWS_SOURCES': 'News Sources: ',
            'TODAY': 'TDA',
            'NOW': 'Now',
            'THE_DAY_WEATHER': 'The Day\'s Weather',
            'THE_DAY_NEWS': 'The Day\'s News',
            'TODAY_NEWS': 'Today\'s News',
            'GEO_ON_MSG': 'Success, Please re-login',
            'GEO_OFF_MSG': 'Success, Please re-login',
            'NEWS_NOT_EXIST': 'News does not exist',
            'NETWORK_ERROR_MSG': 'Network Error, Please try again later'
        },
        'time': {
            'DAWN': 'AM',
            'MORNING': 'AM',
            'FORENOON': 'AM',
            'AFTERNOON': 'PM',
            'EVENING': 'PM',
            'DUSK': 'PM',
            'MIDNIGHT': 'PM'
        },
        'error': {
            'SERVER_ERROR': 'Server Error',
            'USER_EXIST': 'User already exists',
            'USER_NOT_EXIST': 'User does not exist',
            'EMAIL_EXIST': 'Email already exists',
            'EMAIL_NOT_EXIST': 'Email address does not exist',
            'EMAIL_INCORRECT': 'Email address is incorrect',
            'PASSWORD_REQUIRED': 'Password is required',
            'PASSWORD_INCORRECT': 'Password is incorrect',
            'CODE_LATEST': 'Not THE LATEST Code',
            'CODE_EXPIRED': 'Verification Code expired',
            'CODE_ERROR': 'Incorrect Verification Code',
            'CODE_WHAT': 'WHAT?',
            'USERNAME_SPACES': 'Username can\'t contain spaces',
            'USERNAME_LENGTH': 'Max length of Username: 16'
        },
        'ok': {
            'RELOGIN': 'Please re-login',
            'NEW_PASSWORD': 'Please enter new password',
            'ENTER_CODE': 'Enter the Code you received',
            'PASSWORD_CHANGED': 'Password Changed Successfully',
            'SIGNED_UP': 'Sign Up Successfully'
        }
    })
    .translations('zh-HK', {
        'login': {
            'TITLE': '登入',
            'USERNAME': '使用者名稱／電郵地址',
            'FORGOT_TITLE': '忘記密碼',
            'SUBMIT_TITLE': '登入'
        },
        'register': {
            'TITLE': '註冊',
            'USERNAME': '使用者名稱',
            'SUBMIT_TITLE': '註冊'
        },
        'general': {
            'EMAIL': '電郵地址',
            'PASSWORD': '密碼'
        },
        'forgot': {
            'TITLE': '尋找你的帳戶',
            'NEW_PASSWORD': '新密碼',
            'CODE': '驗證碼',
            'NEXT_STEP': '下一步'
        },
        'chat': {
            'USER_COUNT': '線上人數：',
            'JOINED': '加入於',
            'NUMERO_PREFIX': '第 ',
            'NUMERO_SUBFFIX': ' 號用戶',
            'DATE_FORMAT': 'yyyy 年 M 月 d 日',
            'TIME_FORMAT': 'HH 時 mm 分',
            'SOUND': '聲音',
            'LOCATION': '位置',
            'LOCATION_SERVICES': '位置服務',
            'VERSION': '版本',
            'LOG_OUT': '登出',
            'VIEW_ORIGINAL': '查看原圖',
            'NEWS_SOURCES': '新聞來源：',
            'TODAY': '今日',
            'NOW': '現在',
            'THE_DAY_WEATHER': '當日天氣',
            'THE_DAY_NEWS': '當日新聞',
            'TODAY_NEWS': '今日新聞',
            'GEO_ON_MSG': '已開啟服務，請重新登入',
            'GEO_OFF_MSG': '已關閉服務，請重新登入',
            'NEWS_NOT_EXIST': '此時段新聞不存在',
            'NETWORK_ERROR_MSG': '網路錯誤，請稍候再試'
        },
        'time': {
            'DAWN': '破曉',
            'MORNING': '早晨',
            'FORENOON': '午前',
            'AFTERNOON': '午後',
            'EVENING': '傍晚',
            'DUSK': '薄暮',
            'MIDNIGHT': '深夜'
        },
        'error': {
            'SERVER_ERROR': '伺服器錯誤',
            'USER_EXIST': '使用者名稱已存在',
            'USER_NOT_EXIST': '使用者名稱不存在',
            'EMAIL_EXIST': '電郵地址已存在',
            'EMAIL_NOT_EXIST': '電郵地址不存在',
            'EMAIL_INCORRECT': '電郵地址不正確',
            'PASSWORD_REQUIRED': '請輸入您的密碼',
            'PASSWORD_INCORRECT': '密碼不正確',
            'CODE_LATEST': '請輸入最新的驗證碼',
            'CODE_EXPIRED': '驗證碼已經過期了',
            'CODE_ERROR': '這個碼不是我發的',
            'CODE_WHAT': '我不知道你說什麼',
            'USERNAME_SPACES': '使用者名稱不能包含空格',
            'USERNAME_LENGTH': '使用者名稱不能超過十六個字符'
        },
        'ok': {
            'RELOGIN': '請重新登入',
            'NEW_PASSWORD': '請輸入新密碼',
            'ENTER_CODE': '請輸入收到的驗證碼',
            'PASSWORD_CHANGED': '修改密碼成功',
            'SIGNED_UP': '註冊成功'
        }
    })
    .translations('zh-TW', {
        'login': {
            'TITLE': '登入',
            'USERNAME': '使用者名稱／電子郵件地址',
            'FORGOT_TITLE': '忘記密碼',
            'SUBMIT_TITLE': '登入'
        },
        'register': {
            'TITLE': '註冊',
            'USERNAME': '使用者名稱',
            'SUBMIT_TITLE': '註冊'
        },
        'general': {
            'EMAIL': '電子郵件地址',
            'PASSWORD': '密碼'
        },
        'forgot': {
            'TITLE': '尋找你的帳戶',
            'NEW_PASSWORD': '新密碼',
            'CODE': '驗證碼',
            'NEXT_STEP': '下一步'
        },
        'chat': {
            'USER_COUNT': '線上人數：',
            'JOINED': '加入於',
            'NUMERO_PREFIX': '第 ',
            'NUMERO_SUBFFIX': ' 號用戶',
            'DATE_FORMAT': 'yyyy/MM/dd',
            'TIME_FORMAT': 'HH:mm:ss',
            'SOUND': '聲音',
            'LOCATION': '位置',
            'LOCATION_SERVICES': '位置服務',
            'VERSION': '版本',
            'LOG_OUT': '登出',
            'VIEW_ORIGINAL': '查看原圖',
            'NEWS_SOURCES': '新聞來源：',
            'TODAY': '今日',
            'NOW': '現在',
            'THE_DAY_WEATHER': '當日天氣',
            'THE_DAY_NEWS': '當日新聞',
            'TODAY_NEWS': '今日新聞',
            'GEO_ON_MSG': '已開啟服務，請重新登入',
            'GEO_OFF_MSG': '已關閉服務，請重新登入',
            'NEWS_NOT_EXIST': '此時段新聞不存在',
            'NETWORK_ERROR_MSG': '網路錯誤，請稍候再試'
        },
        'time': {
            'DAWN': '破曉',
            'MORNING': '早晨',
            'FORENOON': '午前',
            'AFTERNOON': '午後',
            'EVENING': '傍晚',
            'DUSK': '薄暮',
            'MIDNIGHT': '深夜'
        },
        'error': {
            'SERVER_ERROR': '伺服器錯誤',
            'USER_EXIST': '使用者名稱已存在',
            'USER_NOT_EXIST': '使用者名稱不存在',
            'EMAIL_EXIST': '電子郵件地址已存在',
            'EMAIL_NOT_EXIST': '電子郵件地址不存在',
            'EMAIL_INCORRECT': '電子郵件地址不正確',
            'PASSWORD_REQUIRED': '請輸入您的密碼',
            'PASSWORD_INCORRECT': '密碼不正確',
            'CODE_LATEST': '請輸入最新的驗證碼',
            'CODE_EXPIRED': '驗證碼已經過期了',
            'CODE_ERROR': '這個碼不是我發的',
            'CODE_WHAT': '我不知道你說什麼',
            'USERNAME_SPACES': '使用者名稱不能包含空格',
            'USERNAME_LENGTH': '使用者名稱不能超過十六個字符'
        },
        'ok': {
            'RELOGIN': '請重新登入',
            'NEW_PASSWORD': '請輸入新密碼',
            'ENTER_CODE': '請輸入收到的驗證碼',
            'PASSWORD_CHANGED': '修改密碼成功',
            'SIGNED_UP': '註冊成功'
        }
    })
    .translations('zh-CN', {
        'login': {
            'TITLE': '登录',
            'USERNAME': '用户名／邮箱地址',
            'FORGOT_TITLE': '忘记密码',
            'SUBMIT_TITLE': '登录'
        },
        'register': {
            'TITLE': '注册',
            'USERNAME': '用户名',
            'SUBMIT_TITLE': '注册'
        },
        'general': {
            'EMAIL': '邮箱地址',
            'PASSWORD': '密码'
        },
        'forgot': {
            'TITLE': '寻找你的账号',
            'NEW_PASSWORD': '新密码',
            'CODE': '验证码',
            'NEXT_STEP': '下一步'
        },
        'chat': {
            'USER_COUNT': '在线人数：',
            'JOINED': '加入于',
            'NUMERO_PREFIX': '第 ',
            'NUMERO_SUBFFIX': ' 号用户',
            'DATE_FORMAT': 'yyyy 年 M 月 d 日',
            'TIME_FORMAT': 'HH 时 mm 分',
            'SOUND': '声音',
            'LOCATION': '位置',
            'LOCATION_SERVICES': '位置服务',
            'VERSION': '版本',
            'LOG_OUT': '注销',
            'VIEW_ORIGINAL': '查看原图',
            'NEWS_SOURCES': '新闻来源：',
            'TODAY': '今日',
            'NOW': '现在',
            'THE_DAY_WEATHER': '当日天气',
            'THE_DAY_NEWS': '当日新闻',
            'TODAY_NEWS': '今日新闻',
            'GEO_ON_MSG': '已开启服务，请重新登录',
            'GEO_OFF_MSG': '已关闭服务，请重新登录',
            'NEWS_NOT_EXIST': '此时段新闻不存在',
            'NETWORK_ERROR_MSG': '网络错误，请稍候再试'
        },
        'time': {
            'DAWN': '破晓',
            'MORNING': '早晨',
            'FORENOON': '午前',
            'AFTERNOON': '午后',
            'EVENING': '傍晚',
            'DUSK': '薄暮',
            'MIDNIGHT': '深夜'
        },
        'error': {
            'SERVER_ERROR': '服务器错误',
            'USER_EXIST': '用户名已存在',
            'USER_NOT_EXIST': '用户名不存在',
            'EMAIL_EXIST': '邮箱地址已存在',
            'EMAIL_NOT_EXIST': '邮箱地址不存在',
            'EMAIL_INCORRECT': '邮箱地址不正確',
            'PASSWORD_REQUIRED': '请输入你的密码',
            'PASSWORD_INCORRECT': '密码不正确',
            'CODE_LATEST': '请输入最新的验证码',
            'CODE_EXPIRED': '验证码已过期',
            'CODE_ERROR': '验证码有误',
            'CODE_WHAT': '验证码有误',
            'USERNAME_SPACES': '用户名不能包含空格',
            'USERNAME_LENGTH': '用户名不能超过十六个字符'
        },
        'ok': {
            'RELOGIN': '请重新登录',
            'NEW_PASSWORD': '请输入新密码',
            'ENTER_CODE': '请输入收到的验证码',
            'PASSWORD_CHANGED': '修改密码成功',
            'SIGNED_UP': '注册成功'
        }
    })
    .preferredLanguage('zh-HK')
    // .useLocalStorage()
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