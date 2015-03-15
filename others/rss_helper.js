var Feedparser = require('feedparser'),
    request = require('request');

var feed_list = {
    // 新加坡、馬來西亞 -> 台灣
    // 澳門 -> 香港
    'BR': [
    ],
    // 'CA': [
    // ],
    'CN': [
        'http://news.163.com/special/00011K6L/rss_newsattitude.xml?hl=zh_CN',
        'http://cn.nytimes.com/rss.html',
        'http://www.bbc.co.uk/zhongwen/trad/index.xml',
        'http://cn.engadget.com/rss.xml'
    ],
    'DE': [
    ],
    'FR': [
    ],
    'HK': [
    ],
    'HK': [
        'http://news.google.com.hk/news?pz=1&cf=all&ned=hk&hl=zh-TW&output=rss',
        'https://hk.news.yahoo.com/rss/hong-kong',
        'https://hk.news.yahoo.com/rss/world',
        'http://cn.nytimes.com/rss/zh-hant',
        'http://www.bbc.co.uk/zhongwen/trad/index.xml',
        'http://chinese.engadget.com/rss.xml'
        // 'http://rthk.hk/rthk/news/rss/c_expressnews.xml' // BIG-5
    ],
    'IN': [
    ],
    'JP': [
    ],
    'KR': [
    ],
    // 'MO': [
    // ],
    'RU': [
    ],
    'TW': [
        'https://tw.news.yahoo.com/rss',
        'http://www.appledaily.com.tw/rss/newcreate/kind/rnews/type/new',
        'https://news.google.com/news?pz=1&cf=all&ned=tw&hl=zh-TW&output=rss',
        'http://udn.com/rssfeed/news/1/1/1?ch=news',
        'http://cn.nytimes.com/rss/zh-hant',
        'http://www.bbc.co.uk/zhongwen/trad/index.xml'
    ],
    'US': [
    ]
}

function getNews(callback){

    var feedparser = new Feedparser(),
        req  = request('http://www.36kr.com/feed'),
        // https://news.google.com/news?pz=1&cf=all&ned=hk&hl=zh-TW&output=rss
        news = [];

    req.on('error', function (error){
        console.log(error)
    })
    req.on('response', function (res){

        var stream = this;
        if (res.statusCode != 200){
            return this.emit('error', new Error('Bad status code'));
        }
        stream.pipe(feedparser);
    })
    feedparser.on('error', function(error){
        console.log(error)
    })
    feedparser.on('readable', function(){

        var stream = this,
            meta = this.meta,
            item;
        while (item = stream.read()){
            news.push({
                'title': item.title,
                'url'  : item.link,
                'date' : item.date
                // item.link.substr(item.link.indexOf('&url')+5)
            })
        }
    })
    feedparser.on('end', function (){
        callback(news.slice(0, 10))
    })
}
module.exports = getNews