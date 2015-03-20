angular.module('ShinyaApp.posHelperServices', [])
.service('syPosHelper', ['$rootScope', function($rootScope){
    
    /*
     * `this.nowPos`: 當前 `.main_box` 位置
     * `this.getBottomPos`: 獲取 `.main_box` 底部位置
     * `this.storeNowPos`: 保存 `.main_box` 當前位置
     * `this.setNowPos`: 設置 `.main_box` 當前位置
     * `this.getBottomPos`: 獲取 `.main_box` 底部位置
     * `this.isBottom`: 判斷是否在 `.main_box` 底部
     * `this.scrollToBottom`: 滾動到 `.main_box` 底部
     *
     */
    this.nowPos = 0
    this.storeNowPos = function (){
        var mainBoxElem = document.querySelector('.main_box')
        this.nowPos = mainBoxElem.scrollTop
    }
    this.setNowPos = function (nowPos){
        var mainBoxElem = document.querySelector('.main_box')
        mainBoxElem.scrollTop = nowPos
    }
    this.getBottomPos = function (){
        var mainBoxElem = document.querySelector('.main_box')
        return mainBoxElem.scrollHeight - mainBoxElem.clientHeight
    }
    this.isBottom = function (){
        var mainBoxElem = document.querySelector('.main_box')
        return !(mainBoxElem.scrollHeight - mainBoxElem.clientHeight - mainBoxElem.scrollTop)
    }
    this.scrollToBottom = function (){
        if (!$rootScope.isMobile){
            angular.element(document.querySelector('.main_box'))
            .scrollTo(0, this.getBottomPos(), 717)
            .then(function(){
                console.log('scroll to bottom')
            })
        } else {
            this.setNowPos(this.getBottomPos())
        }
    }
}])