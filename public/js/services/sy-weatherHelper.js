angular.module('ShinyaApp.weatherHelperServices', [])
.service('syWeatherHelper', function(){

    this.getCityWeatherType = function (code){
        
        if (code < 300){
            return 'lightning'
        } else if (code < 600){
            return 'rain'
        } else if (code < 700){
            return 'snow'
        } else if (code < 800){
            return 'fog'
        } else if (code == 800){
            return 'sun'
        } else {
            return 'clouds'
        }
    },
    this.getGeoWeatherType = function (code){

    }
})