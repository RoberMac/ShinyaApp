angular.module('ShinyaApp.chatController', [])
.controller('chatController', ['$rootScope', '$scope', '$http', '$timeout', '$window', '$location', '$route', '$filter', 'jwtHelper','store', 
    function ($rootScope, $scope, $http, $timeout, $window, $location, $route, $filter, jwtHelper, store){
    
    // init
    $scope.token = store.get('id_token')
    $scope.decodeToken = jwtHelper.decodeToken($scope.token)
    // ngSwitch
    $scope.isChatBox = true
    $scope.toggleChatBox = function (){
        $scope.isChatBox = !$scope.isChatBox
    }
    // ngIf
    $scope.isNews = false
    $scope.toggleNewsBox = function (){
        $scope.isNews = !$scope.isNews
    }

    // 用戶註冊當日時刻
    function partsOfADay (hour) {

        if (0 < hour && hour <= 3){
            return '深夜'
        } else if (3 < hour && hour <= 6){
            return '破曉'
        } else if (6 < hour && hour <= 9){
            return '早晨'
        } else if (9 < hour && hour <= 12){
            return '午前'
        } else if (12 < hour && hour <= 15){
            return '午後'
        } else if (15 < hour && hour <= 18){
            return '傍晚'
        } else if (18 < hour && hour <= 21){
            return '薄暮'
        } else {
            return '深夜'
        }
    }

    // 從 JWT 解碼獲取用戶信息
    $scope.infoBox = {
        username: $scope.decodeToken.username,
        numero: $scope.decodeToken.numero,
        date: $filter('date')($scope.decodeToken.date, 'yyyy 年 M 月 d 日'),
        partsOfADay: partsOfADay($window.parseInt($filter('date')($scope.decodeToken.date, 'H')))
    }
    // 用戶註冊次序號
    $scope.getNumero = function (){

        var numero = $scope.infoBox.numero
        if (numero < 10){
            return 'gold'
        } else if(numero < 100){
            return 'aluminum'
        } else {
            return 'steel'
        }
    }
    /*
     * 用戶註冊時刻：「白天」／「夜晚」
     *     「白天」：CSS Class -> daytime -> 黑邊黑字
     *     「夜晚」：CSS Class -> night -> 黑底白字
     */
    $scope.getPartsOfADay = function (){

        var day = $window.parseInt($filter('date')($scope.decodeToken.date, 'H'))
        if (9 < day && day < 18){
            return 'daytime'
        } else {
            return 'night'
        }
    }
    /*
     * 用戶註冊當日新聞
     *     `$scope.newsIndex` 保存當前新聞頁碼
     *     `$scope.newsBox` 新聞列表
     *     `$scope.getDateNews` 獲取新聞，
     *         成功： `$scope.newsIndex` 加一
     *         失敗：
     *             狀態碼 401：JWT 過期，跳轉到首頁
     *             狀態碼 400：已無更多新聞
     */
    $scope.newsIndex = 0
    $scope.newsBox = []
    $scope.newsTips = '更多'
    $scope.isNoMoreNews = false
    $scope.getDateNews = function (){

        $http.
        post('/api/getDateNews', {
            index: $scope.newsIndex
        }).
        success(function (data, status, headers, config){
            $scope.newsBox.push(data.msg)
            $scope.newsIndex ++
            if ($scope.isNews === false){
                $scope.toggleNewsBox()
            }
        }).
        error(function (data, status, headers, config){
            if (status === 401){
                $location.path('/')
            } else if (status === 400){
                $scope.newsTips = data.msg
                $timeout(function (){
                    $scope.isNoMoreNews = true
                    $scope.newsIndex = 0
                }, 1717)
            }
        })
    }

    $scope.deleteNews = function (){
   
    }
    // 註銷
    $scope.quit = function (){
        store.remove('id_token')
        $location.path('/')
    }

    // Socket.IO
    $scope.msgInbox = []
    $scope.msgOutbox = {
        'textMsg': ''
    }
    function newMsg(data) {
        var mainBox = document.querySelector('.main_box'),
            before  = mainBox.scrollHeight - mainBox.clientHeight - mainBox.scrollTop,
            isMe    = $rootScope.socket.id === data.id;
        $scope.$apply(function (){
            $scope.msgInbox.push({
                'isMe': isMe,
                'msg' : data.msg,
                'username': data.username
            })
        })
        /* 
         * 當用戶處於 main_box 底部，新消息到來時自動滾動到底部
         * 此外，當用戶回滾查看歷史消息時，新消息到來時不會自動滾動到底部
         * 另外，當用戶發送新消息時，滾動到底部
         *
         */
        if (before <= 0 || isMe){
            mainBox.scrollTop = mainBox.scrollHeight - mainBox.clientHeight
        } else {
            // 提醒用戶新消息到來
        }
    }
    $scope.emitTextMsg = function (){
        // 屏蔽純空白輸入，由於 ngInput 默認 trim，故只需判斷是否為空，無需判斷空白字符
        if ($scope.msgOutbox.textMsg !== ''){
            $rootScope.socket.emit('chat message', {
                'id': $rootScope.socket.id,
                'type': 'text',
                'msg': $scope.msgOutbox.textMsg,
                'username': $scope.infoBox.username
            })
            $scope.msgOutbox.textMsg = ''
        }
    }

    if (!$rootScope.socket){
        $rootScope.socket = io(':8080', {
            'query': 'token=' + $scope.token
            // 'secure': true
        })
        // $rootScope.socket.on('connect', function (){
        //   $rootScope.socket.send()
        //   $rootScope.socket.on('message', function (msg){
        //     newMsg(msg)
        //   })
        // })
        $rootScope.socket.on('chat message', function (msg){
            newMsg(msg)
        })
        // $rootScope.socket.on('add username', function (msg){
        //     newMsg(msg)
        // })
        // $rootScope.socket.on('disconnect', function (msg){
        //     newMsg(msg)
        // })
    } else {
        /*
         * 當從 '/chat' 按瀏覽器 back 後
         * 會從 '/' 跳轉回 '/chat'，重新加載 template，斷開 ws 重新鏈接
         *
         */
        $rootScope.socket.disconnect()
        $rootScope.socket.connect()
        $rootScope.socket.on('chat message', function (msg){
            console.log('chat message')
            newMsg(msg)
        })
    }

}])