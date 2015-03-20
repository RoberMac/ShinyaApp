angular.module('ShinyaApp.posHelperServices', [])
.factory('syPosHelper', ['$scope', function($scope){

    var posHelper = {
        // 獲取 `.main_box` 底部位置
        getBottomPos: function (){
            var mainBoxElem = document.querySelector('.main_box')
            return mainBoxElem.scrollHeight - mainBoxElem.clientHeight
        },
        getNowPos: function (){
            var mainBoxElem = document.querySelector('.main_box')
            return mainBoxElem.scrollTop
        },
        setNowPos: function (nowPos){
            var mainBoxElem = document.querySelector('.main_box')
            mainBoxElem.scrollTop =  nowPos
        },
        // 判斷是否在 `.main_box` 底部
        isBottom: function (){
            var mainBoxElem = document.querySelector('.main_box')
            return !(mainBoxElem.scrollHeight - mainBoxElem.clientHeight - mainBoxElem.scrollTop)
        },
        // 滾動到底部
        scrollToBottom: function (){
            angular.element(document.querySelector('.main_box'))
            .scrollTo(0, $scope.getBottomPos(), 717)
            .then(function(){
                console.log('scroll to bottom')
            })
        }
    }

    return posHelper
}])