angular.module('ShinyaApp.chatController', [])
.controller('chatController', [
    '$rootScope', '$scope', '$http',
    '$timeout', '$window', '$location',
    '$filter', '$route', '$translate', 'jwtHelper',
    'store', 'syPosHelper', 'syTimeHelper',
    'syGeoHelper', 'syMsgHelper', 
    function ($rootScope, $scope, $http, $timeout, $window, $location, $filter, $route, $translate, jwtHelper, store, syPosHelper, syTimeHelper, syGeoHelper, syMsgHelper){

    $rootScope.isSubmit = false
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
     *      桌面端：根據點擊 `.sunAndMoon` 切換
     *
     */
    syTimeHelper.getDaytimeOrNight(new Date().getHours()) === 'daytime'
    ? $scope.isSun = true
    : $scope.isSun = false

    $scope.isChatBox = true
    $scope.isInfoBox = false
    $scope.isShowNewsOptions = false
    $scope.isLoadErr = false
    function resetNewsSetting(){
        $scope.isTodayNews = false
        $scope.isShowNewsOptions = false
        $scope.isOtherDateNews = false
    }
    $scope.toggleChatBox = function (action, isResetNewsSetting){

        if (!!action){
            // 移動端
            if (action === 'left'){
                $scope.isChatBox ? $scope.isChatBox = !$scope.isChatBox : null
            } else if (action === 'right'){
                !$scope.isChatBox && $scope.currentPage === 'infoBox'
                ? $scope.isChatBox = !$scope.isChatBox
                : $scope.toggleCurrentPage('infoBox')
                isResetNewsSetting ? resetNewsSetting() : null
            }
        } else {
            // 桌面端
            // 從 `geo_box` / `news_box` 返回 `chat_box` 時，重置 `user_info_box`
            $scope.isChatBox ? null : $scope.toggleCurrentPage('infoBox')
            $scope.isChatBox = !$scope.isChatBox
            $scope.isSun     = !$scope.isSun
            isResetNewsSetting ? resetNewsSetting() : null
        }
        $scope.now_img_list = []
        $scope.isZoomIn = false
        $scope.isShowAtUserBox = false
    }
    $scope.currentPage = 'infoBox'
    $scope.currentPageIs = function (name){

        return $scope.currentPage === name
    }
    $scope.toggleCurrentPage = function (name, isShowNewsOptions){
        if ($scope.currentPage === 'geoBox'){
            // 重置位置狀態，方便再次獲取
            $timeout(function (){
                $scope.geoBox.distance = ''
            }, 717)
        }
        isShowNewsOptions ? resetNewsSetting() : null
        $timeout(function (){
            $scope.currentPage = name
        })
    }
    /*
     **************
     * i18n
     **************
     *
     */
    $scope.i18n_JOIN = $translate.instant('chat.JOINED')
    $scope.i18n_DATE_FORMAT = $translate.instant('chat.DATE_FORMAT')
    $scope.i18n_TIME_FORMAT = $translate.instant('chat.TIME_FORMAT')
    $scope.$on('$translateChangeBeforeStart', function (){
        $scope.isLoadErr = false
        $scope.toggleCurrentPage('loadBox')
    })
    $rootScope.$on('$translateChangeSuccess', function (){
        $route.reload()
    })
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
    // 從 JWT 解碼獲取用戶信息
    $scope.infoBox = {
        title      : $translate.instant('chat.JOINED'),
        username   : decodeToken.username,
        numero     : decodeToken.numero,
        date       : $filter('date')(decodeToken.date, $scope.i18n_DATE_FORMAT),
        country    : decodeToken.country,
        partsOfADay: syTimeHelper.partsOfADay(~~($filter('date')(decodeToken.date, 'H'))),
        weather    : decodeToken.weather.description
    }
    $scope.numero = function (numero){
        return syTimeHelper.getNumero($scope.infoBox.numero)
    }
    $scope.getDaytimeOrNight = syTimeHelper.getDaytimeOrNight(~~($filter('date')(decodeToken.date, 'H')))
    $scope.partWeather = ''
    $scope.togglePartWeather = function (){
        if ($scope.partWeather == syGeoHelper.getCityWeatherType(decodeToken.weather.code)){
            $scope.partWeather = ''
            $scope.infoBox.title = $translate.instant('chat.JOINED')
        } else {
            $scope.partWeather = syGeoHelper.getCityWeatherType(decodeToken.weather.code)
            $scope.infoBox.title = $translate.instant('chat.THE_DAY_WEATHER')
        }
    }
    /*
     ********************
     * 查看其他用戶基本信息
     ********************
     *      `$scope.otherUserInfo` 當前查看的「用戶基本信息」
     *      `$scope.otherUserInfoI` 當前查看的信息 id
     *      `$scope.isOtherDateNews` 切換「今日」／「日期」
     *      `$scope.toggleOtherUserInfo` 查看／隱藏「用戶基本信息」
     *      `$scope.getOtherDateNews` 查看當前用戶註冊當日新聞
     *
     */
    $scope.otherUserInfo = {}
    $scope.otherUserInfoId = 0
    $scope.isOtherDateNews = false
    $scope.toggleOtherUserInfo = function (username, id){
        if (id === $scope.otherUserInfoId){
            // 隱藏「用戶基本信息」
            $scope.otherUserInfoId = 0
            return;
        }
        if (store.get(username)){
            $scope.otherUserInfo = store.get(username)
            $scope.otherUserInfoId = id
        } else {
            $http
            .post('/api/getUserInfo', {
                username: username
            })
            .success(function (data, status, headers, config){
                var info = {
                    username: username,
                    numero: data.msg.numero,
                    country: data.msg.country || 'CN',
                    date: data.msg.date
                }
                // 存儲於本地
                store.set(username, info)
                $scope.otherUserInfo = info
                $scope.otherUserInfoId = id
            })
            .error(function (data, status, headers, config){
            })
        }
    }
    $scope.getOtherDateNews = function (username){
        // 跳轉到「新聞界面」
        $scope.isChatBox = !$scope.isChatBox
        $scope.isSun     = !$scope.isSun
        // 更新新聞設置
        $scope.isTodayNews = false
        $scope.isOtherDateNews = true
        $scope.now_img_list = []
        $scope.isZoomIn = false
        $scope.isShowAtUserBox = false
        // 重置新聞時段 & 上／下一個時段新聞可選性
        $scope.selectDate = new Date().getHours()
        isShowPreOrNextHour()
        // 獲取新聞
        $scope.getSelectedDateNews(username, $scope.otherUserInfo['date'], true)
    }
    /*
     *****************
     * 用戶註冊當日新聞
     *****************
     *     `localStorage[news_id]` 緩存獲取到的新聞
     *     `$scope.selectDateNewsBox` 當前展示的新聞，從 `localStorage[news_id]` 獲取
     *     `$scope.selectDate` 本地時間
     *     `$scope.toggleTodayNews` 切換今日／當日新聞
     *     `$scope.selectNextCountry` 設置獲取新聞的國家
     *     `$scope.preHour` 獲取上一個時間段新聞
     *          更新：`$scope.selectDate`、`$scope.selectDateNewsBox`
     *     `$scope.nextHour` 獲取下一個時間段新聞
     *          更新：`$scope.selectDate`、`$scope.selectDateNewsBox`
     *     `getSelectedDateNews` 獲取新聞，
     *         成功：保存到 `localStorage[news_id]`，更新 `$scope.selectDateNewsBox`
     *         失敗：
     *             狀態碼 401：JWT 過期，跳轉到首頁
     *             狀態碼 400：此時段新聞未獲取，`$scope.isNewsExist` -> false
     */
    $scope.isTodayNews = false
    $scope.isNewsExist = false
    $scope.toggleNewsExist = function (){
        $scope.isNewsExist = !$scope.isNewsExist
    }
    $scope.newsErrMsg = $translate.instant('chat.NEWS_NOT_EXIST')
    $scope.newsDateTitle = $translate.instant('chat.THE_DAY_NEWS')
    $scope.selectDateNewsBox = []
    $scope.selectDate = new Date().getHours()
    $scope.selectCountry = store.get('NG_TRANSLATE_COUNTRY') || $scope.infoBox.country || 'CN'
    var timezoneOffset = new Date().getTimezoneOffset() / 60,
        // 存儲一日，過期刪除
        one_day_news = store.getNamespacedStore('one-day-news', '-'),
        getSelectedDateNews = function (callback, username){
            // 設置十秒期限
            var loadTimer = $timeout(function (){
                $scope.isLoadErr = true
            }, 10000)
            $http.
            post('/api/getSelectedDateNews', {
                username: username,
                selectDate: $scope.selectDate,
                selectCountry: $scope.selectCountry,
                timezoneOffset: timezoneOffset,
                isTodayNews: $scope.isTodayNews
            }).
            success(function (data, status, headers, config){
                $timeout.cancel(loadTimer)
                callback('ok', data.msg)
            }).
            error(function (data, status, headers, config){
                if (status === 401){
                    $scope.quit()
                } else {
                    status === 400 ? $timeout.cancel(loadTimer) : null
                    callback('error', data.msg || $translate.instant('chat.NETWORK_ERROR_MSG'))
                }
            })
        },
        storeOneDayNews = function (news_id, news){
            // 保存「一日」並設置過期時間
            one_day_news.set(news_id, news)
            var tomorrow = Date.now() + 86400000
            store.set('oneDayNewsExpires', syTimeHelper.getDayMs(tomorrow))
        },
        statefulGetSelectedDateNews = function (){
            // 保持「當前狀態（今日／當前／其他用戶）」獲取相應新聞
            $scope.isOtherDateNews
            ? $scope.getSelectedDateNews($scope.otherUserInfo.username, $scope.otherUserInfo['date'], true)
            : $scope.isTodayNews
                ? $scope.getSelectedDateNews(null, Date.now(), true)
                : $scope.getSelectedDateNews(null, decodeToken.date)
        };
    $scope.toggleTodayNews = function (){
        if ($scope.isTodayNews){
            $scope.isTodayNews = false
            // 重置新聞時段 & 上／下一個時段新聞可選性
            $scope.selectDate = new Date().getHours()
            isShowPreOrNextHour()
            $scope.getSelectedDateNews(null, decodeToken.date)
        } else {
            $scope.isTodayNews = true
            // 重置新聞時段 & 上／下一個時段新聞可選性
            $scope.selectDate = new Date().getHours()
            isShowPreOrNextHour()
            $scope.getSelectedDateNews(null, Date.now(), true)
        }
    }
    $scope.selectNextCountry = function (){
        var country_list = ['CN', 'HK', 'TW', 'US', 'JP', 'DE', 'FR', 'IN', 'KR', 'RU', 'BR']
        $scope.selectCountry = country_list[country_list.indexOf($scope.selectCountry) + 1] || 'CN'
        statefulGetSelectedDateNews()
    }
    $scope.getSelectedDateNews = function(username, newsDate, isOneDayNews){
        // 初始化新聞設置
        var username = username || decodeToken.username,
            newsDate = newsDate || Date.now(),
            isOneDayNews = isOneDayNews || false,
            news_id = syTimeHelper.getDayMs(newsDate) + $scope.selectCountry + $scope.selectDate,
            selectDateNews = isOneDayNews ? one_day_news.get(news_id) : store.get(news_id);
        $scope.isShowNewsOptions = true
        $scope.newsDateTitle = $scope.isTodayNews ? $translate.instant('chat.TODAY_NEWS') : $translate.instant('chat.THE_DAY_NEWS')
        $scope.isLoadErr = false
        // 判斷是否從本地獲取新聞
        if (selectDateNews){
            $scope.selectDateNewsBox = selectDateNews
            $scope.currentPage === 'infoBox' ? $scope.toggleCurrentPage('newsBox') : null
            $scope.isNewsExist ? null : $scope.toggleNewsExist()
        } else {
            // 過場動畫
            $scope.toggleCurrentPage('loadBox')
            getSelectedDateNews(function (status, news){
                if (status === 'ok'){
                    $scope.isNewsExist ? null : $scope.toggleNewsExist()
                    news
                    ? isOneDayNews
                        ? storeOneDayNews(news_id, news) // 存儲一日
                        : store.set(news_id, news) // 持久存儲
                    : $scope.isNewsExist ? $scope.toggleNewsExist() : null
                    $scope.selectDateNewsBox = news
                    $scope.currentPage === 'loadBox' ?  $scope.toggleCurrentPage('newsBox') : null
                } else {
                    $scope.currentPage === 'loadBox' ? $scope.toggleCurrentPage('newsBox') : null
                    $scope.newsErrMsg = $translate.instant(news)
                    $scope.isNewsExist ? $scope.toggleNewsExist() : null
                }
            }, username)
        }
    }
    // 判斷是否顯示 上／下一個新聞時段是否為今天「未抓取新聞時段」
    $scope.isShowPreHour = true 
    $scope.isShowNextHour = true
    function isShowPreOrNextHour(){
        var preHour,
            nextHour;
        if ($scope.selectDate === 1){
            preHour = 24,
            nextHour = $scope.selectDate + 1;
        } else if($scope.selectDate === 24){
            preHour = 23,
            nextHour = 1;
        } else {
            preHour = $scope.selectDate - 1,
            nextHour = $scope.selectDate + 1;
        }
        // 判斷上一個時段是否為今天「未抓取新聞時段」
        $scope.isTodayNews && (preHour > new Date().getHours())
        ? $scope.isShowPreHour = false
        : $scope.isShowPreHour = true
        // 判斷下一個時段是否為今日「未抓取新聞時段」
        $scope.isTodayNews && (nextHour > new Date().getHours())
        ? $scope.isShowNextHour = false
        : $scope.isShowNextHour = true
    }
    $scope.preHour = function (){
        if (!$scope.isShowPreHour) return;
        if ($scope.selectDate > 1){
            $scope.selectDate --
            statefulGetSelectedDateNews()
        } else {
            // selectDate === 1
            $scope.selectDate = 24
            statefulGetSelectedDateNews()
        }
        isShowPreOrNextHour()
    }
    $scope.nextHour = function (){
        if (!$scope.isShowNextHour) return;
        if ($scope.selectDate < 24){
            $scope.selectDate ++
            statefulGetSelectedDateNews()
        } else {
            $scope.selectDate = 1
            statefulGetSelectedDateNews()
        }
        isShowPreOrNextHour()
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
        $scope.currentPage === 'infoBox' ? $scope.toggleCurrentPage('settingBox') : null
     }
    $scope.isMuted = !!store.get('isMuted')
    $scope.toggleMuted = function (){
        $scope.isMuted = !$scope.isMuted
        store.set('isMuted', $scope.isMuted)
    }
    $scope.quit = function (){
        store.remove('id_token')
        store.remove('isGeoServices')
        // 登記註銷前用戶名
        $rootScope.lastInfo[0] = decodeToken.username
        $scope.msgInbox = []
        $rootScope.socket.disconnect()
        $location.path('/').replace()
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
                // 登記重新登錄後的「下一步動作」
                $rootScope.lastInfo[1] = 'gotoGeoBox'
                $timeout(function (){
                    $rootScope.$broadcast('turnOnGeoServices', $translate.instant('chat.GEO_ON_MSG'))
                }, 100)
            } else {
                store.set('isGeoServices', false)
                $timeout(function (){
                    $rootScope.$broadcast('turnOffGeoServices', $translate.instant('chat.GEO_OFF_MSG'))
                }, 100)
            }
            $scope.quit()
        }).
        error(function (data, status, headers, config){
            status === 401 ? $scope.quit() : null
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
            $scope.currentPage === 'infoBox' ? $scope.toggleCurrentPage('geoBox') : null
        } else if ($scope.geoBox.distance) {
            // 已開啟「位置服務」
            // 已獲取「位置服務」所需信息，跳轉到 `geo_box`
            $scope.currentPage === 'infoBox' ? $scope.toggleCurrentPage('geoBox') : null
        } else {
            // 未獲取「位置服務」所需信息，跳轉到「過場動畫」
            if ($scope.currentPage === 'infoBox'){
                $scope.toggleCurrentPage('loadBox')
                $scope.isLoadErr = false
                // 設置十秒期限
                var loadTimer = $timeout(function (){
                    $scope.isLoadErr = true
                }, 10000)
            }
            $window.navigator.geolocation.getCurrentPosition(function (pos){
                $http.
                post('/api/getGeoServices', {
                    coords: {
                        lat: pos.coords.latitude,
                        lon: pos.coords.longitude
                    },
                    countryCode: store.get('NG_TRANSLATE_COUNTRY') || 'CN'
                }).
                success(function (data, status, headers, config){
                    $timeout.cancel(loadTimer)
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
                    $scope.currentPage === 'loadBox' ? $scope.toggleCurrentPage('geoBox') : null
                    $timeout(function (){
                        new Vivus('last_weather_svg', {
                            type: 'delayed',
                            duration: 50, 
                            file: 'public/img/Climacons_Font/' + last_weather + '.svg'
                        }, function (){
                            resetWeatherIcon('last_weather_svg', '#CECECF')
                        })
                        new Vivus('now_weather_svg', {
                            type: 'delayed',
                            duration: 50, 
                            file: 'public/img/Climacons_Font/' + now_weather + '.svg'
                        }, function (){
                            resetWeatherIcon('now_weather_svg', '#000')
                        })
                    })
                }).
                error(function (data, status, headers, config){
                    status === 401
                    ? $scope.quit()
                    : status === 404
                        ? $scope.isLoadErr = true
                        : null
                })
            })
        }
    }
    function resetWeatherIcon(id, color){
        angular.element(document.getElementById(id))
        .children()
        .contents()
        .find('path')
        .css({
            stroke: 'inherit',
            fill  : color || '#000'
        })
    }
    /********
     * @user
     ********
     *
     *  `$scope.atUser`：當前 @ 的用戶列表
     *  `$scope.isUserOnline`：判斷用戶是否在線
     *  `$scope.toggleAtUserBox`：顯示／隱藏「在線用戶列表」
     *  `$scope.removeAtUser`：移除用戶從 @ 列表
     *  `$scope.addAtUser`：添加用戶到 @ 列表
     *
     */
    $scope.atUser = []
    $scope.isShowAtUserBox = false
    $scope.toggleAtUserBox = function (){
        $scope.isShowAtUserBox = !$scope.isShowAtUserBox
    }
    $scope.isUserOnline = function (username){
        return $scope.onlineUser.indexOf(username.slice(1)) >= 0
    }
    $scope.$watch('msgOutbox.textMsg', function (newVal, oldVal){

        var at_list = newVal.match(/\@([^\s\@]){1,16}/g)
        if (at_list && at_list !== $scope.atUser){
            // 是否需要「新增」
            var at_list_len = at_list.length
            for (var i = 0; i < at_list_len; i ++){
                $scope.atUser.indexOf(at_list[i]) < 0 ? $scope.atUser.push(at_list[i]) : null
            }
            // 是否需要「刪減」
            var at_user_len = $scope.atUser.length
            for(var i = 0; i < at_user_len; i ++){
                at_list.indexOf($scope.atUser[i]) < 0 ? $scope.atUser.splice(i, 1) : null
            }
        } else {
            $scope.atUser = []
        }
        // 顯示「在線用戶列表」
        if (newVal.match(/\@$/g)){
            $scope.isShowAtUserBox = true
            // 移動端：隱藏鍵盤
            $rootScope.isMobile
            ? document.getElementById('chat_submit_input').blur()
            : null
        }
        // 隱藏「在線用戶列表」
        if (oldVal.match(/\@$/g) || newVal.match(/\@([^\s\@]){1,16}\s$/g)){
            $scope.isShowAtUserBox = false
            // 移動端：顯示鍵盤
            $rootScope.isMobile
            ? document.getElementById('chat_submit_input').focus()
            : document.getElementById('chat_submit_input').focus()
        }
    })
    $scope.removeAtUser = function (username){
        var reg = new RegExp('\\s\?' + username + '\\s\?', 'g')
        $scope.msgOutbox.textMsg = $scope.msgOutbox.textMsg.replace(reg, '')
    }
    $scope.addAtUser = function (username){
        var textMsg = $scope.msgOutbox.textMsg

        textMsg.match(username)
        ? null
        : textMsg.match(/\@$/g)
            ? $scope.msgOutbox.textMsg = textMsg.concat(username + ' ')
            : $scope.msgOutbox.textMsg = textMsg.concat('@' + username + ' ')
        // 若從非「聊天界面」且處於桌面端，切換到「聊天界面」
        !$rootScope.isMobile && !$scope.isChatBox
        ? $scope.toggleChatBox(null, true)
        : null
    }
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
    function onTextMsg(data) {
        var isMe     = $rootScope.socket.id === data.id,
            isBottom = syPosHelper.isBottom($scope.isScrollDown) || $scope.isScrollDown;
        $scope.$apply(function (){
            $scope.msgInbox.push({
                'isMe'      : isMe,
                'isImg'     : data.img_list.length > 0,
                'img_list'  : data.img_list,
                'url_list'  : data.url_list,
                'isShowDate': syMsgHelper.isShowDate(data.date),
                'date'      : data.date,
                'msg'       : data.msg,
                'username'  : data.username,
            })
            data.img_list.length > 0 
            ? $scope.img_list[data.date] = syMsgHelper.imgSanitization(data.img_list)
            : null
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
            $scope.newMsgNotify('atMsg', data.username, data.date)
        } else if (!isMe && !$scope.contentItem){
            $scope.newMsgNotify('newMsg', '新消息')
        }
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
        $scope.isShowAtUserBox = false
    }
    /*
     **************
     * Socket.IO
     **************
     */
    function listenSIO(){
        $rootScope.socket.on('connect', function (){
            // 獲取最近的十條消息
            $rootScope.socket.emit('latestMsg', $scope.msgInbox.length >= 0)
            $rootScope.socket.on('latestMsg', function (data){
                $scope.msgInbox = []
                var data_len = data.length
                for (var i = 0; i < data_len; i++){
                    $scope.$apply(function (){
                        $scope.msgInbox.push({
                            'isMe'      : decodeToken.username === data[i].username,
                            'isImg'     : data[i].img_list.length > 0,
                            'img_list'  : data[i].img_list,
                            'url_list'  : data[i].url_list,
                            'isShowDate': (i === 0) ? true : false,
                            'date'      : data[i].date,
                            'msg'       : data[i].msg,
                            'username'  : data[i].username
                        })
                        data[i].img_list.length > 0
                        ? $scope.img_list[data[i].date] = syMsgHelper.imgSanitization(data[i].img_list)
                        : null
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
    function connectSIO(){
        $rootScope.socket = io('', {
            'query': 'token=' + token,
            'secure': true
        })
        listenSIO()
    }
    function reconnectSIO(){
        $rootScope.socket.disconnect()
        $rootScope.socket.connect('', {
            'query': 'token=' + token,
            'secure': true
        })
        listenSIO()
    }
    // init
    $rootScope.socket
    ? reconnectSIO()
    : connectSIO()
    // 處理登錄後的「下一步動作」
    var lastUser = $rootScope.lastInfo[0],
        nextStep = $rootScope.lastInfo[1];
    if (lastUser && lastUser !== decodeToken.username){
        $rootScope.lastInfo = []
        $window.location.reload()
    } else if (nextStep && nextStep === 'gotoGeoBox'){
        // 開啟「位置服務」後登錄自動跳轉到 `geoBox`
        $rootScope.lastInfo = []
        $scope.isChatBox = !$scope.isChatBox
        $scope.isSun     = !$scope.isSun
        $scope.getGeoServices()
    } else {
        $rootScope.lastInfo = []
    }
    // 清除過期的新聞
    function removeOneDayNews(){
        var ls = $window.localStorage,
            len = localStorage.length,
            reg = /^one-day-news-/,
            j = 0;
        for (var i = 0; i < len; i++){
            reg.test(ls.key(j))
            ? store.remove(ls.key(j))
            : j ++
        }
    }
    store.get('oneDayNewsExpires') < Date.now()
    ? removeOneDayNews()
    : null
}])