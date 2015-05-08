angular.module('ShinyaApp.timeHelperServices', [])
.service('syTimeHelper', ['$translate', function($translate){

    // 用戶註冊當日時刻
    // via http://zh.wikipedia.org/zh-hk/%E5%87%8C%E6%99%A8
    this.partsOfADay = function (hour) {

        if (hour <= 3){
            return $translate.instant('time.MIDNIGHT')
        } else if (hour <= 6){
            return $translate.instant('time.DAWN')
        } else if (hour <= 9){
            return $translate.instant('time.MORNING')
        } else if (hour <= 12){
            return $translate.instant('time.FORENOON')
        } else if (hour <= 15){
            return $translate.instant('time.AFTERNOON')
        } else if (hour <= 18){
            return $translate.instant('time.EVENING')
        } else if (hour <= 21){
            return $translate.instant('time.DUSK')
        } else {
            return $translate.instant('time.MIDNIGHT')
        }
    },
    // 用戶註冊次序號
    this.getNumero = function (numero){

        if (numero < 77){
            return 'gold'
        } else if(numero < 177){
            return 'aluminum'
        } else {
            return 'steel'
        }
    },
    // 判斷「白天」／「夜晚」
    this.getDaytimeOrNight = function (hour){

        return 6 < hour && hour < 18
        ? 'daytime'
        : 'night'
    },
    this.getDayMs = function (date){

        var date = new Date(date)
        return Date.UTC(
                date.getUTCFullYear(),
                date.getUTCMonth(),
                date.getUTCDate()
            )
    }
    this.isSameDay = function (now, last){
        
        return this.getDayMs(now) === this.getDayMs(last)
    }
}])