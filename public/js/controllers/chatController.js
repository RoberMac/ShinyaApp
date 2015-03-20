angular.module('ShinyaApp.chatController', ['duScroll'])
.controller('chatController', ['$rootScope', '$scope', '$http', '$timeout', '$window', '$document', '$location', '$route', '$filter', 'jwtHelper','store', 
    function ($rootScope, $scope, $http, $timeout, $window, $document, $location, $route, $filter, jwtHelper, store){
    
    /*
     * `$scope.nowPos`: 當前 `.main_box` 位置
     * `$scope.getBottomPos`: 獲取 `.main_box` 底部位置
     * `$scope.storeNowPos`: 保存 `.main_box` 當前位置
     * `$scope.setNowPos`: 設置 `.main_box` 當前位置
     * `$scope.getBottomPos`: 獲取 `.main_box` 底部位置
     * `$scope.isBottom`: 判斷是否在 `.main_box` 底部
     * `$scope.scrollToBottom`: 滾動到 `.main_box` 底部
     *
     */
    $scope.nowPos = 0
    $scope.storeNowPos = function (){
        var mainBoxElem = document.querySelector('.main_box')
        $scope.nowPos = mainBoxElem.scrollTop
    }
    $scope.setNowPos = function (nowPos){
        var mainBoxElem = document.querySelector('.main_box')
        mainBoxElem.scrollTop = nowPos
    }
    $scope.getBottomPos = function (){
        var mainBoxElem = document.querySelector('.main_box')
        return mainBoxElem.scrollHeight - mainBoxElem.clientHeight
    }
    $scope.isBottom = function (){
        var mainBoxElem = document.querySelector('.main_box')
        return !(mainBoxElem.scrollHeight - mainBoxElem.clientHeight - mainBoxElem.scrollTop)
    }
    $scope.scrollToBottom = function (){
        if (!$rootScope.isMobile){
            angular.element(document.querySelector('.main_box'))
            .scrollTo(0, $scope.getBottomPos(), 717)
            .then(function(){
                console.log('scroll to bottom')
            })
        } else {
            $scope.setNowPos($scope.getBottomPos())
        }

    }
    // `#chat_box` 和 `#info_box` 切換
    $scope.isChatBox = true
    $scope.isSun     = false
    $scope.toggleChatBox = function (){
        // 切換到 #info_box 前保存當前位置
        if ($scope.isChatBox){
            $scope.storeNowPos()
        }
        $scope.isChatBox = !$scope.isChatBox
        $scope.isSun     = !$scope.isSun
        // 切換回 #chat_box 後會滾到之前位置
        $timeout(function (){
            if ($scope.isChatBox){
                $scope.setNowPos($scope.nowPos)
            }            
        }, 0)

    }
    // `#info_news_box` 切換
    $scope.isNews = false
    $scope.toggleNewsBox = function (){
        $scope.isNews = !$scope.isNews
    }

    var token = store.get('id_token'),
        decodeToken = jwtHelper.decodeToken(token);
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
        username: decodeToken.username,
        numero: decodeToken.numero,
        date: $filter('date')(decodeToken.date, 'yyyy 年 M 月 d 日'),
        partsOfADay: partsOfADay($window.parseInt($filter('date')(decodeToken.date, 'H')))
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
    $scope.getDaytimeOrNight = function (){

        var day = $window.parseInt($filter('date')(decodeToken.date, 'H'))
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
     *     `$scope.newsSourceName` 新聞來源名
     *     `$scope.newsTips` 「更多」提示按鈕
     *     `$scope.isNoMoreNews`  是否還有更多新聞
     *     `$scope.getDateNews` 獲取新聞，
     *         成功： `$scope.newsIndex` 加一
     *         失敗：
     *             狀態碼 401：JWT 過期，跳轉到首頁
     *             狀態碼 400：已無更多新聞
     */
    $scope.newsIndex = 0
    $scope.newsBox = []
    $scope.newsSourceName = ''
    $scope.newsTips = '更多'
    $scope.isNoMoreNews = false
    $scope.getDateNews = function (){

        if ($scope.isNews === false){
            $scope.toggleNewsBox()
        }
        if ($scope.newsIndex < 999){
            $http.
            post('/api/getDateNews', {
                index: $scope.newsIndex
            }).
            success(function (data, status, headers, config){
                $scope.newsBox.push(data.msg)
                $scope.newsSourceName = data.msg.source_name
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
                        $scope.newsIndex = 999
                    }, 1717)
                }
            })
        }
    }

    $scope.deleteNews = function (){
   
    }
    // 註銷
    $scope.quit = function (){
        store.remove('id_token')
        $location.path('/')
    }

    /*
     *************
     * Socket.IO *
     *************
     *  
     * 文本消息抵達與發送
     *
     */    
    $scope.msgInbox = []
    $scope.msgOutbox = {
        'textMsg': ''
    }
    function onTextMsg(data) {
        var isMe = $rootScope.socket.id === data.id,
            beforePush = $scope.isBottom();
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
        if (beforePush || isMe){
            $scope.scrollToBottom()
        } else {
            if (!isMe){
                $scope.msgNotify('newMsg', '新消息')
            }
        }
    }
    $scope.emitTextMsg = function (){

        if(jwtHelper.isTokenExpired(token)){
            $window.location.reload()
        } else {
            // 屏蔽純空白輸入，由於 ngInput 默認 trim，故只需判斷是否為空，無需判斷空白字符
            if ($scope.msgOutbox.textMsg !== ''){
                $rootScope.socket.emit('textMsg', {
                    'id': $rootScope.socket.id,
                    'msg': $scope.msgOutbox.textMsg,
                    'username': $scope.infoBox.username
                })
                $scope.msgOutbox.textMsg = ''
            }
        }
    }
    /*
     * Socket.IO 連接與重連
     *
     */
    function connectSIO(){
        $rootScope.socket = io(':8080', {
            'query': 'token=' + token
            // 'secure': true
        })
        $rootScope.socket.on('connect', function (){

            $rootScope.socket.emit('latestMsg', $scope.msgInbox.length >= 0)
            $rootScope.socket.on('latestMsg', function (msg){
                $scope.$apply(function (){
                    for (var i = 0; i < msg.length; i++){
                        $scope.msgInbox.push({
                            'isMe'    : decodeToken.username === msg[i].username,
                            'msg'     : msg[i].msg,
                            'username': msg[i].username
                        })
                    }
                })
            })
        })
        $rootScope.socket.on('textMsg', function (msg){
            onTextMsg(msg)
        })
        /*
         * `userJoin`: 有用戶加入
         * `disconnect`: 有用戶退出
         *
         */
        $rootScope.socket.on('userJoin', function (count){
            $scope.onUserIO(count)
        })
        $rootScope.socket.on('disconnect', function (count){
            $scope.onUserIO(count)
        })
    }
    function reconnectSIO(){
        console.log('reconnect')
        $rootScope.socket.disconnect()
        $rootScope.socket.connect(':8080')
        $rootScope.socket.on('textMsg', function (msg){
            console.log('textMsg')
            onTextMsg(msg)
        })
    }
    if (!$rootScope.socket){
        connectSIO()
    } else {
        /*
         * 當從 '/chat' 按瀏覽器 back 後
         * 會從 '/' 跳轉回 '/chat'，重新加載 template，斷開重新鏈接
         *
         */
         $window.location.reload()
         reconnectSIO()
    }

}])