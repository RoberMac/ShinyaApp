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

//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//:::                                                                         :::
//:::  This routine calculates the distance between two points (given the     :::
//:::  latitude/longitude of those points). It is being used to calculate     :::
//:::  the distance between two locations using GeoDataSource (TM) prodducts  :::
//:::                                                                         :::
//:::  Definitions:                                                           :::
//:::    South latitudes are negative, east longitudes are positive           :::
//:::                                                                         :::
//:::  Passed to function:                                                    :::
//:::    lat1, lon1 = Latitude and Longitude of point 1 (in decimal degrees)  :::
//:::    lat2, lon2 = Latitude and Longitude of point 2 (in decimal degrees)  :::
//:::    unit = the unit you desire for results                               :::
//:::           where: 'M' is statute miles (default)                         :::
//:::                  'K' is kilometers                                      :::
//:::                  'N' is nautical miles                                  :::
//:::                                                                         :::
//:::  Worldwide cities and other features databases with latitude longitude  :::
//:::  are available at http://www.geodatasource.com                          :::
//:::                                                                         :::
//:::  For enquiries, please contact sales@geodatasource.com                  :::
//:::                                                                         :::
//:::  Official Web site: http://www.geodatasource.com                        :::
//:::                                                                         :::
//:::               GeoDataSource.com (C) All Rights Reserved 2015            :::
//:::                                                                         :::
//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

function distanceHelper(lat1, lon1, lat2, lon2, unit) {
    var radlat1 = Math.PI * lat1/180
    var radlat2 = Math.PI * lat2/180
    var radlon1 = Math.PI * lon1/180
    var radlon2 = Math.PI * lon2/180
    var theta = lon1-lon2
    var radtheta = Math.PI * theta/180
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    dist = Math.acos(dist)
    dist = dist * 180/Math.PI
    dist = dist * 60 * 1.1515
    if (unit=="K") { dist = dist * 1.609344 }
    if (unit=="N") { dist = dist * 0.8684 }
    return dist
}

var geo_helper = {
    // 地理位置
    getCountryAndCity: function (ip, callback){

        freegeoip.geocode(ip, function (err, data){
            if (err){
                console.log(err)
                callback('CN', 'beijing')
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

        var distance = ~~distanceHelper(origin.lat, origin.lon, destination.lat, destination.lon, 'K')
        callback(!!distance ? distance + ' km' : '+∞ km')
    },
    isSamePlace: function (last, now){

        return Math.abs(last.lat - now.lat) > 0.001
        || Math.abs(last.lon - now.lon) > 0.001
        ? false
        : true
    },
    getTodayMs: function (date){

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
                    +'&lang=zh_tw&units=metric&APPID='
                    + API_KEY['OpenWeatherMap'];
        request({
            url: url,
            json: true
        }, function (err, res, body){
            console.log(body)
            if (!err && res.statusCode == 200) {
                callback({
                    description: body.weather[0].description,
                    temp: body.main.temp,
                    code: body.weather[0].id,
                    isNight: new Date() > body.sys.sunset * 1000
                })
            } else {
                callback({
                    description: '獲取天氣失敗',
                    code: 802,
                    isNight: false
                })
            }
        })
    },
    getGeoWeather: function (lat, lon, callback){

        var url = 'http://api.openweathermap.org/data/2.5/weather?lat='
                    + lat
                    + '&lon='
                    + lon
                    + '&lang=zh_tw&units=metric&APPID='
                    + API_KEY['OpenWeatherMap'];
        request({
            url: url,
            json: true
        }, function (err, res, body){
            console.log(body)
            if (!err && res.statusCode == 200) {
                callback({
                    description: body.weather[0].description,
                    temp: Math.round(body.main.temp),
                    code: body.weather[0].id,
                    isNight: new Date() > body.sys.sunset * 1000
                })
            } else {
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