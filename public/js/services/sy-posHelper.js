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
    var isScrolling = false
    this.storeNowPos = function (){
        var chatBoxElem = document.querySelector('#chat_box')
        this.nowPos = chatBoxElem.scrollTop
    }
    this.getElementPos = function (id){
        var contentItemElem = document.getElementById(id),
            chatBoxElem = document.querySelector('#chat_box');
        return contentItemElem.offsetTop - chatBoxElem.clientHeight / 2
    }
    this.setNowPos = function (nowPos){
        var chatBoxElem = document.querySelector('#chat_box')
        chatBoxElem.scrollTop = nowPos
    }
    this.getBottomPos = function (){
        var chatBoxElem = document.querySelector('#chat_box')
        return chatBoxElem.scrollHeight - chatBoxElem.clientHeight
    }
    this.isBottom = function (currentPage){
        var chatBoxElem = document.querySelector('#chat_box')
        return !(chatBoxElem.scrollHeight - chatBoxElem.clientHeight - chatBoxElem.scrollTop) || isScrolling
    }
    this.scrollToPos = function (pos){

        // 默認滾動到底部
        var target_pos = pos || this.getBottomPos()
        if (!$rootScope.isMobile){
            isScrolling = true
            angular.element(document.querySelector('#chat_box'))
            .scrollTo(0, target_pos, 717)
            .then(function(){
                isScrolling = false
            })
        } else {
            this.setNowPos(target_pos)
        }
    }
}])