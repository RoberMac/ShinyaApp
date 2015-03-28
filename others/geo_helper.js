var request   = require('request'),
    distance  = require('google-distance'),
    API_KEY   = 'AIzaSyAbDnuQxB6VIAjG7O6Te4p_a1NvQws6Hy0',
    geocoder  = require('node-geocoder');
    

var google_geocoder  = geocoder('google', 'https', {
        apiKey: API_KEY,
        language: 'zh-HK'
    }),
    freegeoip = geocoder('freegeoip', 'https');


var geo_helper = {
    // 地理位置
    getCountryAndCity: function (ip, callback){

        freegeoip.geocode(ip, function (err, data){
            if (err){
                console.log(err)
                callback('', '')
                return err
            }
            console.log(data[0])
            callback(data[0].countryCode, data[0].city)
        })
    },
    getStreetName: function (origin, callback){

        google_geocoder.reverse({
            lat: origin.lat, 
            lon: origin.lon
        }, function (err, data){
            if (err){
                console.log(err)
                callback('洛陽城四零四號山洞')
                return err
            }
            console.log(data[0])
            callback(data[0].streetName)
        });
    },
    // 距離
    getDistance: function (origin, destination, callback){

        distance.get({
            origin: origin.lat + ', ' + origin.lon,
            destination: destination.lat + ', ' + destination.lon
        }, function (err, data){
            if (err) {
                callback({
                    distance: null,
                    location: null,
                    destination: '逍遙谷'
                })
                return err
            }
            callback(data)
        })
    },
    // initCoords: function (country){
    //     var coords = {
    //         'CN': '30.254258, 120.163803',
    //         'HK': '22.231148, 114.251095',
    //         'TW': '25.049465, 121.542131',
    //         'US': '37.340193, -122.068768',
    //         'BR': '-22.911926, -43.230145',
    //         'JP': '35.693433, 139.699471',
    //         'FR': '43.701732, 7.300161',
    //         'KR': '',
    //         'RU': ''
    //     }
    // },
    isSamePlace: function (last, now){

        return Math.abs(last.lat - now.lat) > 0.001
        || Math.abs(last.lon - now.lon) > 0.001
        ? false
        : true
    },
    getTodayMs: function (){
        var date = new Date()
        return Date.parse(
                new Date(
                    date.getUTCFullYear(),
                    date.getUTCMonth(),
                    date.getUTCDate()
                    )
                )
    },
    // 天氣
    getCityWeather: function (city, callback){

        var url = 'http://api.openweathermap.org/data/2.5/weather?q='
                    + city
                    +'&lang=zh_tw&units=metric';
        request({
            url: url,
            json: true
        }, function (err, res, body){
            if (!err && res.statusCode == 200) {
                console.log(body)
                callback({
                    description: body.weather[0].description,
                    code: body.weather[0].id
                })
            } else {
                callback({
                    description: '多雲',
                    code: '802'
                })
            }
        })
    },
    getGeoWeather: function (lat, lon, callback){

        var url = 'http://api.openweathermap.org/data/2.5/weather?lat='
                    + lat
                    + '&lon='
                    + lon
                    + '&lang=zh_tw&units=metric';
        request(url, function (err, res, body){
            if (!error && response.statusCode == 200) {
                callback(body)
            } else {
                callback()
            }
        })
    }
}

module.exports = geo_helper