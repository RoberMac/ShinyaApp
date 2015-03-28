angular.module('ShinyaApp.weatherHelperServices', [])
.service('syWeatherHelper', function(){

    this.getCityWeatherType = function (code){
        // http://openweathermap.org/weather-conditions
        if (code < 300){
            // Thunderstorm 200 ~ 232
            return 'lightning'
        } else if (code < 600){
            // Drizzle & Rain 300 ~ 321 & 500 ~ 531
            return 'rain'
        } else if (code < 700){
            // Snow 600 ~ 622
            return 'snow'
        } else if (code < 800){
            // Atmosphere 701 ~ 781
            return 'fog'
        } else if (code === 800 || code === 801 || code === 904){
            // Sun 800, 904
            return 'sun'
        } else if (code < 900){
            // Clouds 801 ~ 804
            return 'clouds'
        } else if (code < 1000){
            // Extreme & Additional
            return 'wind'
        } else {
            return 'others'
        }
    },
    this.getGeoWeatherType = function (code){

    }
})