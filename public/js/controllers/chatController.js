angular.module('ShinyaApp.chatController', [])
.controller('chatController', ['$rootScope', '$scope', '$http', '$timeout', '$window', '$location', '$filter', 'jwtHelper','store', 'syPosHelper', 'syTimeHelper', 'syWeatherHelper', 
    function ($rootScope, $scope, $http, $timeout, $window, $location, $filter, jwtHelper, store, syPosHelper, syTimeHelper, syWeatherHelper){

    // `#chat_box` 和 `#info_box` 切換
    $scope.isChatBox = true
    $scope.isSun     = false
    $scope.toggleChatBox = function (){
        // 切換到 #info_box 前保存當前位置
        if ($scope.isChatBox){
            syPosHelper.storeNowPos()
        }
        $scope.isChatBox = !$scope.isChatBox
        $scope.isSun     = !$scope.isSun
        // 切換回 #chat_box 後會滾到之前位置
        $timeout(function (){
            if ($scope.isChatBox){
                syPosHelper.setNowPos(syPosHelper.nowPos)
            }
        }, 0)
    }
    /*
     **************
     * 用戶基本信息
     **************
     *      `$scope.infoBox`
     *          title: 加入於／當日天氣
     *          username: 用戶名
     *          numero: 註冊序號
     *          date: 註冊日期
     *          partsOfADay: 註冊當天時分
     *          weather: 當天天氣
     *
     */
    // `#info_news_box` 用戶信息
    var token = store.get('id_token'),
        decodeToken = jwtHelper.decodeToken(token);
    console.log(decodeToken)
    // 從 JWT 解碼獲取用戶信息
    $scope.infoBox = {
        title      : '加入於',
        username   : decodeToken.username,
        numero     : decodeToken.numero,
        date       : $filter('date')(decodeToken.date, 'yyyy 年 M 月 d 日'),
        partsOfADay: syTimeHelper.partsOfADay(~~($filter('date')(decodeToken.date, 'H'))),
        weather    : decodeToken.weather.description
    }
    $scope.numero = syTimeHelper.getNumero($scope.infoBox.numero)
    $scope.getDaytimeOrNight = syTimeHelper.getDaytimeOrNight(~~($filter('date')(decodeToken.date, 'H')))
    $scope.partWeather = ''
    $scope.togglePartWeather = function (){
        if ($scope.partWeather == syWeatherHelper.getCityWeatherType(decodeToken.weather.code)){
            $scope.partWeather = ''
            $timeout(function (){
                $scope.infoBox.title = '加入於'
            }, 777)
        } else {
            $scope.partWeather = syWeatherHelper.getCityWeatherType(decodeToken.weather.code)
            $timeout(function (){
                $scope.infoBox.title = '當日天氣'
            }, 777)
        }
    }
    /*
     *****************
     * 用戶註冊當日新聞
     *****************
     *     `$scope.newsBox` 緩存獲取到的新聞
     *     `$scope.selectDateNewsBox` 當前展示的新聞，從 `$scope.newsBox` 獲取
     *     `$scope.selectDate` 本地時間
     *     `$scope.previousHour` 獲取上一個時間段新聞
     *          更新：`$scope.selectDate`、`$scope.selectDateNewsBox`
     *     `$scope.nextHour` 獲取下一個時間段新聞
     *          更新：`$scope.selectDate`、`$scope.selectDateNewsBox`
     *     `getSelectedDateNews` 獲取新聞，
     *         成功：保存到 `$scope.newsBox`，更新 `$scope.selectDateNewsBox`
     *         失敗：
     *             狀態碼 401：JWT 過期，跳轉到首頁
     *             狀態碼 400：此時段新聞未獲取，`$scope.isNewsExist` -> false
     */
    $scope.isNews = false
    $scope.isNewsExist = false
    $scope.toggleNewsBox = function (){
        $scope.isNews = !$scope.isNews
    }
    $scope.toggleNewsExist = function (){
        $scope.isNewsExist = !$scope.isNewsExist
    }
    $scope.newsBox = {}
    $scope.selectDateNewsBox = []
    $scope.timezoneOffset = new Date().getTimezoneOffset() / 60
    $scope.selectDate = new Date().getHours()
    function getSelectedDateNews(callback){
        $http.
        post('/api/getSelectedDateNews', {
            selectDate: $scope.selectDate,
            timezoneOffset: $scope.timezoneOffset
        }).
        success(function (data, status, headers, config){
            callback('ok', data.msg)
        }).
        error(function (data, status, headers, config){
            if (status === 401){
                $location.path('/')
            } else {
                callback('error', data.msg)
            }
        })
    }
    $scope.getSelectedDateNews = function(){
        if ($scope.selectDate in $scope.newsBox){
            // 從 `$scope.newsBox` 獲取，不執行 `getSelectedDateNews`
            $scope.selectDateNewsBox = $scope.newsBox[$scope.selectDate]
            if ($scope.isNews === false){
                $scope.toggleNewsBox()
            }
            if (!$scope.isNewsExist){
                $scope.toggleNewsExist()
            }
            console.log($scope.selectDateNewsBox)
        } else {
            getSelectedDateNews(function (status, news){
                if (status === 'ok'){
                    $scope.newsBox[$scope.selectDate] = news
                    $scope.selectDateNewsBox = $scope.newsBox[$scope.selectDate]
                    if ($scope.isNews === false){
                        $scope.toggleNewsBox()
                    }
                    if (!$scope.isNewsExist){
                        $scope.toggleNewsExist()
                    }
                } else {
                    if ($scope.isNewsExist){
                        $scope.toggleNewsExist()
                    }
                }
            })
        }
    }
    $scope.previousHour = function (){
        if ($scope.selectDate > 1){
            $scope.selectDate --
            $scope.getSelectedDateNews()
        } else {
            $scope.selectDate = 24
            $scope.getSelectedDateNews()
        }
    }
    $scope.nextHour = function (){
        if ($scope.selectDate < 24){
            $scope.selectDate ++
            $scope.getSelectedDateNews()
        } else {
            $scope.selectDate = 1
            $scope.getSelectedDateNews()
        }
    }

    // 註銷
    $scope.quit = function (){
        store.remove('id_token')
        $rootScope.socket.disconnect()
        $location.path('/')
    }
    /*
     **************
     * 地理位置相關
     **************
     *
     * 若已開啟，自動獲取
     */
    $scope.geoBox = {}
    $scope.isGeoOn = false
    if (decodeToken.isGeoServices){
        $scope.isGeoOn = true
        $window.navigator.geolocation.getCurrentPosition(function (pos){
            console.log(pos.coords.latitude, pos.coords.longitude)
            $http.
            post('/api/getGeoServices', {
                coords: {
                    lat: pos.coords.latitude,
                    lon: pos.coords.longitude
                }
            }).
            success(function (data, status, headers, config){
                $scope.geoBox = data.msg
            }).
            error(function (data, status, headers, config){

            })
        })
    } else {
        console.log('geo services off')
    }
    $scope.toggleGeoServices = function (){
        if (!$scope.isGeoOn){
            $http.
            get('/api/turnOnGeoServices').
            success(function (data, status, headers, config){
                $scope.$emit('preTurnOnGeoServices', '驗證身份以開啟服務')
                $scope.quit()
            }).
            error(function (data, status, headers, config){
                
            })
        } else {
            $http.
            get('/api/turnOffGeoServices').
            success(function (data, status, headers, config){
                $scope.$emit('preTurnOffGeoServices', '驗證身份以取消服務')
                $scope.quit()
            }).
            error(function (data, status, headers, config){
                
            })
        }
    }
    /*
     ************
     * Socket.IO
     ************
     *  
     * 文本消息抵達與發送
     *
     */
    $scope.msgInbox = []
    $scope.msgOutbox = {
        'textMsg': ''
    }
    // 間隔 60 秒顯示時間
    var now = Date.now()
    function isShowDate(date){
        if (date - now > 1000 * 60){
            now = Date.now()
            return true
        } else {
            return false
        }
    }
    function onTextMsg(data) {
        var isMe       = $rootScope.socket.id === data.id,
            isBottom   = syPosHelper.isBottom();
        $scope.$apply(function (){
            $scope.msgInbox.push({
                'isMe'      : isMe,
                'isShowDate': isShowDate(data.date),
                'date'      : data.date,
                'msg'       : data.msg,
                'username'  : data.username
            })
        })
        /* 
         * 當用戶處於 chat_box 底部，新消息到來時自動滾動到底部
         * 當用戶回滾查看歷史消息時，新消息到來時不會自動滾動到底部
         * 當用戶發送新消息時，滾動到底部
         *
         */
        if (isBottom || isMe){
            syPosHelper.scrollToBottom()
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
                    'id'      : $rootScope.socket.id,
                    'msg'     : $scope.msgOutbox.textMsg,
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
                            'isMe'      : decodeToken.username === msg[i].username,
                            'isShowDate': (i === 0) ? true : false,
                            'date'      : msg[i].date,
                            'msg'       : msg[i].msg,
                            'username'  : msg[i].username
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
         // $window.location.reload()
         reconnectSIO()
    }

}])