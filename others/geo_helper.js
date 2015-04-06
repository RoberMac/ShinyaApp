var request   = require('request'),
    geocoder  = require('node-geocoder');

var API_KEY = {
    'Google': 'AIzaSyAbDnuQxB6VIAjG7O6Te4p_a1NvQws6Hy0',
    'OpenWeatherMap': 'aaa8cad9839995223b58ea36eaa93c2b'
},
    google_geocoder = geocoder('google', 'https', {
        apiKey: API_KEY['Google'],
        language: 'zh-HK'
    }),
    freegeoip = geocoder('freegeoip', 'https');

var geo_helper = {
    // 地理位置
    getCountryAndCity: function (ip, callback){

        log.info('[Geo: getCountryAndCity]')
        freegeoip.geocode(ip, function (err, data){
            if (err){
                log.error('[Geo: getCountryAndCity]', err)
                callback('CN', 'beijing')
                return err
            }
            callback(data[0].countryCode, data[0].city)
        })
    },
    getStreetName: function (origin, callback){

        log.info('[Geo: getStreetName]')
        google_geocoder.reverse({
            lat: origin.lat, 
            lon: origin.lon
        }, function (err, data){
            if (err){
                log.error('[Geo: getStreetName]', err)
                callback('洛陽城四零四號山洞')
                return err
            }
            callback(data[0].streetName)
        });
    },
    isSamePlace: function (last, now){

        return Math.abs(last.lat - now.lat) > 0.001
        || Math.abs(last.lon - now.lon) > 0.001
        ? false
        : true
    },
    getTodayMs: function (date){

        return Date.UTC(
                date.getUTCFullYear(),
                date.getUTCMonth(),
                date.getUTCDate()
            )
    },
    // 天氣
    getCityWeather: function (city, callback){

        log.info('[Geo: getCityWeather]')
        var url = 'http://api.openweathermap.org/data/2.5/weather?q='
                    + city
                    +'&lang=zh_tw&units=metric&APPID='
                    + API_KEY['OpenWeatherMap'];
        request({
            url: url,
            json: true
            // timeout: 2500
        }, function (err, res, body){
            if (!err && res.statusCode == 200) {
                callback({
                    description: body.weather[0].description,
                    temp: body.main.temp,
                    code: body.weather[0].id,
                    isNight: new Date() > body.sys.sunset * 1000
                })
            } else {
                log.error('[Geo: getCityWeather]', err, res.statusCode)
                callback({
                    description: '獲取天氣失敗',
                    code: 802,
                    isNight: false
                })
            }
        })
    },
    getGeoWeather: function (lat, lon, callback){

        log.info('[Geo: getGeoWeather]')
        var url = 'http://api.openweathermap.org/data/2.5/weather?lat='
                    + lat
                    + '&lon='
                    + lon
                    + '&lang=zh_tw&units=metric&APPID='
                    + API_KEY['OpenWeatherMap'];
        request({
            url: url,
            json: true
            // timeout: 2500
        }, function (err, res, body){
            if (!err && res.statusCode == 200) {
                callback({
                    description: body.weather[0].description,
                    temp: Math.round(body.main.temp),
                    code: body.weather[0].id,
                    isNight: new Date() > body.sys.sunset * 1000
                })
            } else {
                log.error('[Geo: getGeoWeather]', err, res.statusCode)
                callback({
                    description: '獲取天氣失敗',
                    code: 802,
                    isNight: false
                })
            }
        })
    }
}

module.exports = geo_helper