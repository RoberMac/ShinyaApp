angular.module('ShinyaApp.msgHelperServices', [])
.service('syMsgHelper', function(){

    function sinaImgHelper (img_url, size){
        return img_url.replace(/square|thumbnail|thumb150|bmiddle|mw600|large/, size)
    }
    var now = Date.now()
    // 間隔 60 秒顯示時間
    this.isShowDate = function (date){
        if (date - now > 1000 * 60){
            now = Date.now()
            return true
        } else {
            return false
        }
    },
    // 將文本消息中包含的圖片超鏈接替換
    this.msgSanitization = function (msg, img_list){
        var number   = ['一', '二', '三', '四', '五', '六', '七', '八', '九'],
            list_len = img_list.length;
        for (var i = 0; i < list_len; i++){
            msg = msg.replace(img_list[i], '[圖' + number[i]+ ']')
        }
        return msg
    },
    // 將圖片超鏈接提取出「縮略圖」、「中圖」、「大圖」，目前僅支持新浪圖庫
    this.imgSanitization = function (img_list){
        var cache    = [],
            list_len = img_list.length;
        for (var i = 0; i < list_len; i++){
            if (img_list.indexOf('sinaimg.cn' > 0)){
                // 新浪圖床
                cache.push({
                    'thumbnail': sinaImgHelper(img_list[i], 'square'),
                    'bmiddle'  : sinaImgHelper(img_list[i], 'bmiddle'),
                    'large'    : sinaImgHelper(img_list[i], 'large')
                })
            } else {
                cache.push({
                    'thumbnail': img_list[i],
                    'bmiddle'  : img_list[i],
                    'large'    : img_list[i]
                })
            }
        }
        return cache
    }
})