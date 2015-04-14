angular.module('ShinyaApp.chatController', [])
.controller('chatController', ['$rootScope', '$scope', '$http', '$timeout', '$window', '$location', '$filter', 'jwtHelper','store', 'syPosHelper', 'syTimeHelper', 'syGeoHelper', 'syMsgHelper', 
    function ($rootScope, $scope, $http, $timeout, $window, $location, $filter, jwtHelper, store, syPosHelper, syTimeHelper, syGeoHelper, syMsgHelper){

    /*
     **********
     * 頁面切換
     **********
     *  `$scope.isChatBox`：是否處於 `chat_box` 頁面
     *  `$scope.isSun`：提示標誌(白天／夜晚)
     *  `$scope.toggleChatBox`：切換頁面
     *      移動端：根據滑動切換
     *          右滑：若處於 `chat_box`，切換到 `info_box`
     *               若處於 `geo_box` / `news_box / `load_box`，切換到 `info_box`
     *
     *          左滑：若處於 `info_box`，切換到 `chat_box`
     *
     *      桌面段：根據點擊 `.sunAndMoon` 切換
     *
     */
    $scope.isChatBox = true
    if (syTimeHelper.getDaytimeOrNight(new Date().getHours()) === 'daytime'){
        $scope.isSun = true        
    } else {
        $scope.isSun = false
    }
    $scope.isInfoBox = false
    $scope.toggleChatBox = function (action){

        if (!!action){
            // 移動端
            if (action === 'left'){
                if ($scope.isChatBox){
                    $scope.isChatBox = !$scope.isChatBox
                }
            } else if (action === 'right'){
                if (!$scope.isChatBox && $scope.currentPage === 'infoBox'){
                    $scope.isChatBox = !$scope.isChatBox
                } else {
                    $scope.toggleCurrentPage('infoBox')
                }
            }
        } else {
            // 桌面端
            if (!$scope.isChatBox){
                // 從 `geo_box` / `news_box` 返回 `chat_box` 時，重置 `user_info_box`
                $scope.toggleCurrentPage('infoBox')
            }
            $scope.isChatBox = !$scope.isChatBox
            $scope.isSun     = !$scope.isSun
        }
        $scope.now_img_list = []
        $scope.isZoomIn = false
    }
    $scope.currentPage = 'infoBox'
    $scope.toggleCurrentPage = function (name){
        $timeout(function (){
            $scope.currentPage = name
        })
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
     *          partsOfADay: 註冊當日時分
     *          weather: 當日天氣
     *
     */
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
        if ($scope.partWeather == syGeoHelper.getCityWeatherType(decodeToken.weather.code)){
            $scope.partWeather = ''
            $timeout(function (){
                $scope.infoBox.title = '加入於'
            }, 777)
        } else {
            $scope.partWeather = syGeoHelper.getCityWeatherType(decodeToken.weather.code)
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
    $scope.isNewsExist = false
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
                $location.path('/').replace()
            } else {
                callback('error', data.msg)
            }
        })
    }
    $scope.getSelectedDateNews = function(){
        if ($scope.selectDate in $scope.newsBox){
            // 從 `$scope.newsBox` 獲取，不執行 `getSelectedDateNews`
            $scope.selectDateNewsBox = $scope.newsBox[$scope.selectDate]
            if ($scope.currentPage === 'infoBox'){
                $scope.toggleCurrentPage('newsBox')
            }
            if (!$scope.isNewsExist){
                $scope.toggleNewsExist()
            }
        } else {
            // 過場動畫
            $scope.toggleCurrentPage('loadBox')
            getSelectedDateNews(function (status, news){
                if (status === 'ok'){
                    $scope.newsBox[$scope.selectDate] = news
                    $scope.selectDateNewsBox = $scope.newsBox[$scope.selectDate]
                    if ($scope.currentPage === 'loadBox'){
                        $scope.toggleCurrentPage('newsBox')
                    }
                    if (!$scope.isNewsExist){
                        $scope.toggleNewsExist()
                    }
                } else {
                    if ($scope.currentPage === 'loadBox'){
                        $scope.toggleCurrentPage('newsBox')
                    }
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
    /**********
     * 設置界面
     **********
     *
     *  `$scope.gotoSettingBox`：跳轉到「設置界面」
     *  `$scope.quit`：註銷
     *  `$scope.toggleGeoServices`：開關「位置服務」
     *
     */
    $scope.gotoSettingBox = function (){
        if ($scope.currentPage === 'infoBox'){
            $scope.toggleCurrentPage('settingBox')
        }
     }
    $scope.isMuted = !!store.get('isMuted')
    $scope.toggleMuted = function (){
        $scope.isMuted = !$scope.isMuted
        store.set('isMuted', $scope.isMuted)
    }
    $scope.quit = function (){
        store.remove('id_token')
        store.remove('isGeoServices')
        $rootScope.socket.disconnect()
        $location.path('/')
    }
    $scope.isGeoServices = store.get('isGeoServices') || decodeToken.isGeoServices
    $scope.toggleGeoServices = function (){
        $http.
        post('/api/toggleGeoServices', {
            'isGeoServices': !$scope.isGeoServices
        }).
        success(function (data, status, headers, config){
            if (data.msg === 'on'){
                store.set('isGeoServices', true)
                $scope.$emit('preTurnOnGeoServices', '驗證身份以開啟服務')
            } else {
                store.set('isGeoServices', false)
                $scope.$emit('preTurnOffGeoServices', '驗證身份以關閉服務')
            }
            $scope.quit()
        }).
        error(function (data, status, headers, config){
            if (status === 401){
                $location.path('/')
            }
        })
    }
    /*
     **************
     * 地理位置相關
     **************
     * 
     * `$scope.geoBox`：地理位置信息
     * `$scope.weatherBox`：天氣信息
     * `$scope.isGeoServices`：是否已開啟「位置服務」
     * `$scope.isSameDay`：判斷是否同一天
     * `$scope.getGeoServices`：獲取位置信息
     *
     */
    $scope.geoBox = {}
    $scope.weatherBox = {}
    $scope.isSameDay = false
    $scope.getGeoServices = function (){
        if (!$scope.isGeoServices){
            // 未開啟「位置服務」
            if ($scope.currentPage === 'infoBox'){
                $scope.toggleCurrentPage('geoBox')
            }
        } else if ($scope.geoBox.distance) {
            // 已開啟「位置服務」
            // 已獲取「位置服務」所需信息，跳轉到 `geo_box`
            if ($scope.currentPage === 'infoBox'){
                $scope.toggleCurrentPage('geoBox')
            }
        } else {
            // 未獲取「位置服務」所需信息，跳轉到「過場動畫」
            if ($scope.currentPage === 'infoBox'){
                $scope.toggleCurrentPage('loadBox')
            }
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

                    var last_code    = data.msg.last_geo.weather.code,
                        last_isNight = data.msg.last_geo.weather.isNight,
                        now_code     = data.msg.now_geo.weather.code,
                        now_isNight  = data.msg.now_geo.weather.isNight
                        last_weather = syGeoHelper.getGeoWeatherType(last_code, last_isNight),
                        now_weather  = syGeoHelper.getGeoWeatherType(now_code, now_isNight);

                    $scope.geoBox = data.msg
                    $scope.geoBox.distance = syGeoHelper.getDistance(data.msg.last_geo, data.msg.now_geo)
                    $scope.weatherBox = {
                        'last_weather': last_weather,
                        'now_weather': now_weather
                    }
                    $scope.isSameDay = syTimeHelper.isSameDay($scope.geoBox.now_geo.date, $scope.geoBox.last_geo.date)
                    if ($scope.currentPage === 'loadBox'){
                        $scope.toggleCurrentPage('geoBox')
                    }
                }).
                error(function (data, status, headers, config){
                    if (status === 401){
                        $location.path('/')
                    }
                })
            })
        }
    }
    /********
     * @user
     ********
     *
     *  `$scope.atUser`：當前 @ 的用戶列表
     *  `$scope.isUserOnline`：判斷用戶是否在線
     *
     */
    $scope.atUser = []
    $scope.isUserOnline = function (username){
        return $scope.onlineUser.indexOf(username.slice(1)) >= 0
    }
    $scope.$watch('msgOutbox.textMsg', function (newVal, oldVal){

        var at_list = newVal.match(/\@([^\s\@]){1,16}/g)
        if (at_list && at_list !== $scope.atUser){
            // 是否需要「新增」
            var at_list_len = at_list.length
            for (var i = 0; i < at_list_len; i ++){
                if ($scope.atUser.indexOf(at_list[i]) < 0){
                    $scope.atUser.push(at_list[i])
                }
            }
            // 是否需要「刪減」
            var at_user_len = $scope.atUser.length
            for(var i = 0; i < at_user_len; i ++){
                if (at_list.indexOf($scope.atUser[i]) < 0){
                    $scope.atUser.splice(i, 1)
                }
            }
        } else {
            $scope.atUser = []
        }
    })
    /*
     *******************
     * 文本消息抵達與發送
     *******************
     *  
     *  `$scope.msgInbox`：存儲消息
     *  `$scope.msgOutbox`：待發送消息
     *  `onTextMsg`：文本消息抵達
     *  `$scope.emitTextMsg`：文本消息發送
     *
     */
    $scope.msgInbox = []
    $scope.msgOutbox = {
        'textMsg': ''
    }
    $scope.msgPosInfo = []
    function onTextMsg(data) {
        var isMe     = $rootScope.socket.id === data.id,
            isBottom = syPosHelper.isBottom($scope.isScrollDown) || $scope.isScrollDown;
        $scope.$apply(function (){
            $scope.msgInbox.push({
                'isMe'      : isMe,
                'isImg'     : data.img_list.length > 0,
                'isShowDate': syMsgHelper.isShowDate(data.date),
                'date'      : data.date,
                'msg'       : syMsgHelper.msgSanitization(data.msg, data.img_list),
                'username'  : data.username,
            })
            if (data.img_list.length > 0){
                $scope.img_list[data.date] = syMsgHelper.imgSanitization(data.img_list)
            }
        })
        /* 新消息抵達時：
         *      當用戶處於 chat_box 底部，滾動到底部
         *      若不處於 chat_box，新消息提醒
         *      當用戶回滾查看歷史消息時，新消息提醒
         *      當用戶發送新消息時，滾動到底部
         *
         */
        if ((isBottom || isMe) && $scope.isChatBox){
            syPosHelper.scrollToPos()
        } else if (data.at && data.at.indexOf('@' + decodeToken.username) >= 0){
            $scope.msgNotify('atMsg', data.username, data.date)
        } else if (!isMe && !$scope.contentItem){
            $scope.msgNotify('newMsg', '新消息')
        }
        // 存儲消息頂部與底部位置
        $scope.msgPosInfo.push({
            'id': data.date,
            'topPos': syPosHelper.getElemTopPos(data.date),
            'bottomPos': syPosHelper.getElemBottomPos(data.date)
        })
    }
    $scope.emitTextMsg = function (){

        var at_list = $scope.msgOutbox.textMsg.match(/\@([^\s\@]){1,16}/g)
        // 屏蔽純空白輸入，由於 ngInput 默認 trim，故只需判斷是否為空，無需判斷空白字符
        if ($scope.msgOutbox.textMsg !== ''){
            $rootScope.socket.emit('textMsg', {
                'id'      : $rootScope.socket.id,
                'msg'     : $scope.msgOutbox.textMsg,
                'username': $scope.infoBox.username,
                'at'      : at_list
            })
            // 重置 `$scope.atUser` & `$scope.msgOutbox.textMsg`
            $scope.atUser = ''
            $scope.msgOutbox.textMsg = ''
        }
        $scope.isZoomIn = false
    }
    /*
     **************
     * Socket.IO
     **************
     */
    function connectSIO(){
        $rootScope.socket = io(':8080', {
            'query': 'token=' + token
            // 'secure': true
        })
        $rootScope.socket.on('connect', function (){
            // 獲取最近的十條消息
            $rootScope.socket.emit('latestMsg', $scope.msgInbox.length >= 0)
            $rootScope.socket.on('latestMsg', function (data){
                var data_len = data.length
                for (var i = 0; i < data_len; i++){
                    $scope.$apply(function (){
                        $scope.msgInbox.push({
                            'isMe'      : decodeToken.username === data[i].username,
                            'isImg'     : data[i].img_list.length > 0,
                            'isShowDate': (i === 0) ? true : false,
                            'date'      : data[i].date,
                            'msg'       : syMsgHelper.msgSanitization(data[i].msg, data[i].img_list),
                            'username'  : data[i].username
                        })
                        if (data[i].img_list.length > 0){
                            $scope.img_list[data[i].date] = syMsgHelper.imgSanitization(data[i].img_list)
                        }
                    })
                    // 存儲消息頂部與底部位置
                    $scope.msgPosInfo.push({
                        'id': data[i].date,
                        'topPos': syPosHelper.getElemTopPos(data[i].date),
                        'bottomPos': syPosHelper.getElemBottomPos(data[i].date)
                    })
                }
            })
        })
        /* 新文本消息抵達 */
        $rootScope.socket.on('textMsg', function (msg){
            onTextMsg(msg)
        })
         /* 有用戶加入 */
        $rootScope.socket.on('userJoin', function (msg){
            $scope.onUserIO(msg)
        })
         /* 有用戶退出 */
        $rootScope.socket.on('disconnect', function (msg){
            $scope.onUserIO(msg)
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
        reconnectSIO()
    }

}])