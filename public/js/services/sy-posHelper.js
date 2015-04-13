angular.module('ShinyaApp.posHelperServices', [])
.service('syPosHelper', ['$rootScope', function($rootScope){
    
    /*
     * `this.nowPos`: 當前 `#chat_box` 位置
     * `this.getBottomPos`: 獲取 `#chat_box` 底部位置
     * `this.storeNowPos`: 保存 `#chat_box` 當前位置
     * `this.setNowPos`: 設置 `#chat_box` 當前位置
     * `this.getBottomPos`: 獲取 `#chat_box` 底部位置
     * `this.isBottom`: 判斷是否在 `#chat_box` 底部
     * `this.scrollToBottom`: 滾動到 `#chat_box` 底部
     *
     * `isScrolling` 是否正在滾動
     *      是：若新消息抵達，滾動到底部
     *      否：根據是否在底部和是否本人發送新消息，判斷是否需要滾動到底部
     */
    this.nowPos = 0
    this.chatBoxHeight = document.getElementById('chat_box').clientHeight
    this.storeNowPos = function (){
        this.nowPos = document.getElementById('chat_box').scrollTop
    }
    this.getNowPos = function (){
        return document.getElementById('chat_box').scrollTop
    }
    this.getElemTopPos = function (id){
        return document.getElementById(id).offsetTop
    }
    this.getElemBottomPos = function (id){
        return document.getElementById(id).offsetTop + document.getElementById(id).clientHeight
    }
    this.setNowPos = function (nowPos){
        document.getElementById('chat_box').scrollTop = nowPos
    }
    this.getBottomPos = function (){
        var chatBoxElem = document.getElementById('chat_box')
        return chatBoxElem.scrollHeight - chatBoxElem.clientHeight
    }
    this.isBottom = function (){
        var chatBoxElem = document.getElementById('chat_box')
        return (chatBoxElem.scrollHeight - chatBoxElem.clientHeight - chatBoxElem.scrollTop <= 0)
    }
    this.scrollToPos = function (pos, isScrollDown){

        // 默認滾動到底部
        var target_pos = pos || this.getBottomPos()
        if (!$rootScope.isMobile){
            angular.element(document.getElementById('chat_box'))
            .scrollTo(0, target_pos, 171)
            .then(function(){
                isScrollDown = false
            })
        } else {
            this.setNowPos(target_pos)
        }
    }
}])