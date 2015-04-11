angular.module('ShinyaApp.autoscrollDirective' ,[])
.directive('syAutoscroll', ['syPosHelper', function (syPosHelper){
    return {
        restrict: 'A',
        link: function (scope, elem, attrs){
            var pos = syPosHelper.getNowPos()
            elem.bind('scroll', function (){
                var now_pos = syPosHelper.getNowPos(),
                    top_pos = syPosHelper.getNowPos() - 16,
                    bottom_pos = syPosHelper.getNowPos() + syPosHelper.chatBoxHeight - 16,
                    pos_info_len = scope.msgPosInfo.length;
                if (now_pos > pos){
                    // Scroll Down
                    scope.isScrollDown = true
                    // 以 `chat_box` 底部為基準，獲取當前閱覽消息
                    // for (var i = 0; i < pos_info_len; i++){
                    //     var posInfo = scope.msgPosInfo[i]
                    //     if (bottom_pos > posInfo.topPos && bottom_pos < posInfo.bottomPos){
                    //         if (scope.img_list[posInfo.id]){
                    //             scope.$apply(function (){
                    //             })
                    //         }
                    //     }
                    // }
                } else {
                    // Scroll Up
                    scope.isScrollDown = false
                    // 以 `chat_box` 頂部為基準，獲取當前閱覽消息
                    // for (var i = 0; i < pos_info_len; i++){
                    //     var posInfo = scope.msgPosInfo[i]
                    //     if (top_pos > posInfo.topPos && top_pos < posInfo.bottomPos){
                    //         // 若該消息包含圖片信息，提取並存儲到 `$scope.now_img_list`
                    //         scope.$apply(function (){
                    //         })
                    //     }
                    // }
                }
                pos = now_pos
                if (syPosHelper.isBottom(scope.isScrollDown)){
                    scope.$apply(function (){
                        scope.viewedMsg(2)
                    })
                }
            })
        }
    }
}])