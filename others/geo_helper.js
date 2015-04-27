var request   = require('request'),
    geocoder  = require('node-geocoder');

var API_KEY = {
    'Google': process.env.GKEY || '',
    'OpenWeatherMap': process.env.OKEY || ''
},
    google_geocoder = geocoder('google', 'https', {
        apiKey: API_KEY['Google'],
        language: 'zh-HK'
    }),
    freegeoip = geocoder('freegeoip', 'https');

// Q
var q_request = function (url){

    var deferred = Q.defer()
    request({
        url: url,
        json: true
    }, function (err, res, body){
        if (!err && res.statusCode == 200) {
            deferred.resolve([err, res, body])
        } else {
            deferred.reject([err, res, body])
        }
    })
    return deferred.promise
},
    q_geocode  = Q.nbind(freegeoip.geocode, freegeoip),
    q_reverse  = Q.nbind(google_geocoder.reverse, google_geocoder);


var geo_helper = {
    // 地理位置
    getCountryAndCity: function (ip){

        log.info('[Geo: getCountryAndCity]')

        return q_geocode(ip)
        .timeout(3000)
        .then(function(data){
            return [data[0].countryCode, data[0].city]
        })
        .fail(function (err){
            log.error('[Geo: getCountryAndCity]', err)
            return ['CN', 'beijing']
        })
    },
    getStreetName: function (origin){

        log.info('[Geo: getStreetName]')

        return q_reverse({
            lat: origin.lat, 
            lon: origin.lon
        })
        .timeout(3000)
        .then(function (data){
            return data[0].streetName
        })
        .fail(function (err){
            log.error('[Geo: getStreetName]', err)
            return '洛陽城四零四號山洞'
        })
    },
    isSamePlace: function (last, now){

        return Math.abs(last.lat - now.lat) > 0.001
        || Math.abs(last.lon - now.lon) > 0.001
        ? false
        : true
    },
    getDayMs: function (date){

        return Date.UTC(
                date.getUTCFullYear(),
                date.getUTCMonth(),
                date.getUTCDate()
            )
    },
    // 天氣
    getCityWeather: function (city){

        log.info('[Geo: getCityWeather]')
        var url = 'http://api.openweathermap.org/data/2.5/weather?q='
                    + city
                    +'&lang=zh_tw&units=metric&APPID='
                    + API_KEY['OpenWeatherMap'];

        return q_request(url)
        .timeout(3000)
        .spread(function (err, res, body){
            return {
                description: body.weather[0].description,
                code: body.weather[0].id,
                isNight: new Date() > body.sys.sunset * 1000
            }
        })
        .fail(function (err){
            log.error('[Geo: getCityWeather]', err)
            return {
                description: '多雲',
                code: 802,
                isNight: false
            }
        })
    },
    getGeoWeather: function (lat, lon){

        log.info('[Geo: getGeoWeather]')
        var url = 'http://api.openweathermap.org/data/2.5/weather?lat='
                    + lat
                    + '&lon='
                    + lon
                    + '&lang=zh_tw&units=metric&APPID='
                    + API_KEY['OpenWeatherMap'];

        return q_request(url)
        .timeout(3000)
        .spread(function (err, res, body){
            return {
                description: body.weather[0].description,
                temp: Math.round(body.main.temp),
                code: body.weather[0].id,
                isNight: new Date() > body.sys.sunset * 1000
            }
        })
        .fail(function (err){
            log.error('[Geo: getGeoWeather]', err)
            return {
                description: '多雲',
                temp: 17,
                code: 802,
                isNight: false
            }
        })
    }
}

module.exports = geo_helper