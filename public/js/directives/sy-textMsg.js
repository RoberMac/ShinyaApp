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
                msg = msg.replace(new RegExp(url_list[i] + '(?!\")'), 
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
    var siteList = {
        // 社交
        'zhihu.com': '知乎',
        'weibo.com': '微博',
        'douban.com': '豆瓣',
        'weixin.qq.com': '微信',
        // 購物
        'taobao.com': '淘宝',
        'tmall.com': '天猫',
        'etao.com': '一淘',
        'jd.com': '京东',
        'amazon.cn': '亚马逊中国',
        'suning.com': '苏宁易购',
        'yixun.com': '易迅网',
        'meituan.com': '美团',
        'apple.com': 'Apple',
        // 視頻
        'youku.com': '优酷',
        'tudou.com': '土豆',
        'iqiyi.com': '爱奇艺',
        'tv.sohu.com': '搜狐视频',
        'letv.com': '乐视',
        'bilibili.com': '哔哩哔哩',
        'acfun.tv': 'AcFun',
        'cntv.cn': '央视网',
        'v.qq.com': '腾讯视频',
        // 门户
        'qq.com': '腾讯',
        '163.com': '网易',
        'sohu.com': '搜狐',
        'sina.com.cn': '新浪',
        'people.com.cn': '人民网',
        'xinhuanet.com': '新华网',
        'ifeng.com': '鳳凰網',
        // 其他
        '58.com': '58 同城',
        'ganji.com': '赶集',
        'dxy.cn': '丁香园',
        'hupu.com': '虎扑体育',
        'shenyepoxiao.com': '深夜，破曉。'
    },
        siteKey = Object.keys(siteList),
        len = siteKey.length;

    for (var i = 0; i < len; i++){
        if (url.indexOf(siteKey[i]) >= 0){
            return siteList[siteKey[i]]
        }
    }
    // 不存在於網站列表
    var url_parser = document.createElement('a'),
        reg = /(?:\w*\.)?(\w+)(?=\.(\w)+)/g;
    url_parser.href = url
    try {
        return reg.exec(url_parser.hostname)[1].toUpperCase()
    } catch (e){
        return '❓'
    }
}