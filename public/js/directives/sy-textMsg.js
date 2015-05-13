angular.module('ShinyaApp.textMsgDirective', [])
.directive('syTextMsg', ['$compile', function ($compile){
    return {
        restrict: 'A',
        scope: {
            contentItem: '=item',
            imgClick: '&'
        },
        link: function (scope, elem, attr){

            var msg = scope.contentItem.msg,
                img_list = scope.contentItem.img_list,
                img_list_len = img_list.length,
                url_list = scope.contentItem.url_list,
                url_list_len = url_list.length;
            // 將文本消息中包含的[圖片超連結]替換
            for (var i = 0; i < img_list_len; i++){
                msg = msg.replace(img_list[i], 
                    '<span class=\"img_item faster_animate\" ng-click=\"imgClick({contentItem: contentItem, index: '
                    + i
                    + '})\"></span>')
            }
            // 將文本消息中包含的「超連結」替換
            for (var i = 0; i < url_list_len; i++){

                var url_title = urlSanitization(url_list[i])
                msg = msg.replace(url_list[i], 
                    '<span class="url_item faster_animate"><a class="faster_animate" href=\"'
                    + url_list[i]
                    + '\" target=\"_blank\">'
                    + url_title
                    + '</a></span>')
            }
            elem.html(msg)
            $compile(elem.contents())(scope)
        }
    }
}])

function urlSanitization(url){

        var url_parser = document.createElement('a');
        url_parser.href = url;

        return url_parser.hostname
}
    // 將文本消息中包含的圖片超鏈接替換
    // this.msgSanitization = function (msg, img_list){
    //     var number   = [
    //     // 因限制了 1024 個字符，故圖片數目一般不超過以下列表的數字
    //             '一', '二', '三', '四', '五', '六', '七', '八', '九', '十', 
    //             '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '廿', 
    //             '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '卅', 
    //             '卅一', '卅二', '卅三', '卅四', '卅五', '卅六', '卅七', '卅八', '卅九' 
    //         ],
    //         img_list_len = img_list.length;
    //     for (var i = 0; i < img_list_len; i++){
    //         msg = msg.replace(img_list[i], '[圖' + (number[i] ? number[i] : ' ' + (i + 1)) + ']')
    //     }
    //     return msg
    // },