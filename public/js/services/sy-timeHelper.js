angular.module('ShinyaApp.timeHelperServices', [])
.service('syTimeHelper', function(){

    // 用戶註冊當日時刻
    this.partsOfADay = function (hour) {

        if (0 < hour && hour <= 3){
            return '深夜'
        } else if (3 < hour && hour <= 6){
            return '破曉'
        } else if (6 < hour && hour <= 9){
            return '早晨'
        } else if (9 < hour && hour <= 12){
            return '午前'
        } else if (12 < hour && hour <= 15){
            return '午後'
        } else if (15 < hour && hour <= 18){
            return '傍晚'
        } else if (18 < hour && hour <= 21){
            return '薄暮'
        } else {
            return '深夜'
        }
    },
    // 用戶註冊次序號
    this.getNumero = function (numero){

        if (numero < 10){
            return 'gold'
        } else if(numero < 100){
            return 'aluminum'
        } else {
            return 'steel'
        }
    },
    /*
     * 用戶註冊時刻：「白天」／「夜晚」
     *     「白天」：CSS Class -> daytime -> 黑邊黑字
     *     「夜晚」：CSS Class -> night -> 黑底白字
     */
    this.getDaytimeOrNight = function (day){

        if (9 < day && day < 18){
            return 'daytime'
        } else {
            return 'night'
        }
    }
})