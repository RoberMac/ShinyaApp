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
    // `#info_news_box` 切換
    $scope.isNews = false
    $scope.toggleNewsBox = function (){
        $scope.isNews = !$scope.isNews
    }
    // `#info_news_box` 用戶信息
    var token = store.get('id_token'),
        decodeToken = jwtHelper.decodeToken(token);
    console.log(decodeToken)
    // 從 JWT 解碼獲取用戶信息
    $scope.infoBox = {
        username: decodeToken.username,
        numero: decodeToken.numero,
        date: $filter('date')(decodeToken.date, 'yyyy 年 M 月 d 日'),
        partsOfADay: syTimeHelper.partsOfADay(~~($filter('date')(decodeToken.date, 'H')))
    }
    $scope.numero = syTimeHelper.getNumero($scope.infoBox.numero)
    $scope.getDaytimeOrNight = syTimeHelper.getDaytimeOrNight(~~($filter('date')(decodeToken.date, 'H')))
    $scope.partWeather = ''
    $scope.getPartWeather = function (){
        if ($scope.partWeather == syWeatherHelper.getCityWeatherType(decodeToken.weather.code)){
            $scope.partWeather = ''
        } else {
            $scope.partWeather = syWeatherHelper.getCityWeatherType(decodeToken.weather.code)
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
     *     `$scope.getSelectedDateNews` 獲取新聞，
     *         成功：保存到 `$scope.newsBox`，更新 `$scope.selectDateNewsBox`
     *         失敗：
     *             狀態碼 401：JWT 過期，跳轉到首頁
     *             狀態碼 400：此時段新聞未獲取
     */
    $scope.newsBox = []
    $scope.selectDateNewsBox = []
    $scope.timezoneOffset = new Date().getTimezoneOffset() / 60
    $scope.selectDate = new Date().getHours()
    $scope.previousHour = function (){
        if ($scope.selectDate > 1){
            $scope.selectDate --
            $scope.getSelectedDateNews(function (){
                $scope.selectDateNewsBox = $scope.newsBox[$scope.selectDate]
            })
        } else {
            $scope.selectDate = 24
            $scope.getSelectedDateNews(function (){
                $scope.selectDateNewsBox = $scope.newsBox[$scope.selectDate]
            })
        }
    }
    $scope.nextHour = function (){
        if ($scope.selectDate < 24){
            $scope.selectDate ++
            $scope.getSelectedDateNews(function (){
                $scope.selectDateNewsBox = $scope.newsBox[$scope.selectDate]
            })
        } else {
            $scope.selectDate = 1
            $scope.getSelectedDateNews(function (){
                $scope.selectDateNewsBox = $scope.newsBox[$scope.selectDate]
            })
        }
    }
    $scope.getSelectedDateNews = function (callback){
        console.log($scope.selectDate)
        if ($scope.isNews === false){
            $scope.toggleNewsBox()
        }
        $http.
        post('/api/getSelectedDateNews', {
            selectDate: $scope.selectDate,
            timezoneOffset: $scope.timezoneOffset
        }).
        success(function (data, status, headers, config){
            $scope.newsBox[$scope.selectDate] = data.msg
            console.log($scope.newsBox)
            if (callback){
                // 從 previousHour 或 nextHour 執行
                callback()
            } else {
                // 從 !isNews 頁面執行
                $scope.selectDateNewsBox = $scope.newsBox[$scope.selectDate]
            }
            // $scope.newsSourceName = data.msg.source_name
            if ($scope.isNews === false){
                $scope.toggleNewsBox()
            }
        }).
        error(function (data, status, headers, config){
            if (status === 401){
                $location.path('/')
            } else if (status === 400){
                // 不再發出請求
                if (callback){
                    // 從 previousHour 或 nextHour 執行
                    callback()
                } else {
                    // 從 !isNews 頁面執行
                    $scope.selectDateNewsBox = $scope.newsBox[$scope.selectDate]
                }
            }
        })
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
            beforePush = syPosHelper.isBottom();
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
         * 當用戶處於 main_box 底部，新消息到來時自動滾動到底部
         * 此外，當用戶回滾查看歷史消息時，新消息到來時不會自動滾動到底部
         * 另外，當用戶發送新消息時，滾動到底部
         *
         */
        if (beforePush || isMe){
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