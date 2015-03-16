var Feedparser = require('feedparser'),
    request = require('request');

var feed_list = {
    'BR': [
        {'source_name': 'Yahoo Mundo', 'url': 'https://br.noticias.yahoo.com/mundo/?format=rss'}, // Yahoo Mundo
        {'source_name': 'G1 - Brasil', 'url': 'http://g1.globo.com/dynamo/brasil/rss2.xml'} // G1 - Brasil
    ],
    // 'CA': [
    // ],
    'CN': [
        // {'source_name': '紐約時報中文網', 'url': 'http://cn.nytimes.com/rss.html'}, // 紐約時報中文網
        // {'source_name': 'BBC 中文網', 'url': 'http://www.bbc.co.uk/zhongwen/trad/index.xml'}, // BBC 中文網
        // {'source_name': 'Engadget 中文版', 'url': 'http://cn.engadget.com/rss.xml'}, // Engadget 中文版
        {'source_name': '知乎每日精选', 'url': 'http://www.zhihu.com/rss'}, // 知乎每日精选
        {'source_name': '极客公园', 'url': 'http://www.geekpark.net/rss'}, // 极客公园
        {'source_name': '36 氪', 'url': 'http://www.36kr.com/feed'} // 36氪
    ],
    'DE': [
        {'source_name': 'SPIEGEL ONLINE', 'url': 'http://www.spiegel.de/schlagzeilen/tops/index.rss'}, // SPIEGEL ONLINE - Schlagzeilen
        {'source_name': 'SPIEGEL ONLINE', 'url': 'http://www.spiegel.de/schlagzeilen/index.rss'}, // SPIEGEL ONLINE - Schlagzeilen
        {'source_name': 'Google News', 'url': 'https://news.google.com/news?pz=1&cf=all&ned=de&hl=de&output=rss'}, // Google News
        {'source_name': 'Yahoo nachrichten', 'url': 'https://de.nachrichten.yahoo.com/rss'} // Yahoo nachrichten
    ],
    'FR': [
        {'source_name': 'Le Monde', 'url': 'http://feeds.lefigaro.fr/c/32266/f/438191/index.rss'}, // Le Monde
        {'source_name': 'Google News', 'url': 'https://news.google.com/news?pz=1&cf=all&ned=fr&hl=fr&output=rss'}, // Google News
        {'source_name': 'Yahoo France', 'url': 'https://fr.news.yahoo.com/france/?format=rss'}, // Yahoo - France
        {'source_name': 'Yahoo', 'url': 'https://fr.news.yahoo.com/?format=rss'} // Yahoo - Toute l'actualité en France et dans le monde
    ],
    'HK': [ 
        {'source_name': 'Google 新聞', 'url': 'https://news.google.com.hk/news?pz=1&cf=all&ned=hk&hl=zh-TW&output=rss'}, // Google 新聞
        {'source_name': 'Yahoo 新聞', 'url': 'https://hk.news.yahoo.com/rss'}, // Yahoo 新聞 - 最新焦點新聞 & 頭條報道
        {'source_name': 'Yahoo 新聞', 'url': 'https://hk.news.yahoo.com/rss/hong-kong'}, // Yahoo 新聞 - 港聞新聞
        {'source_name': '東方日報', 'url': 'http://orientaldaily.on.cc/rss/news.xml'}, // 東方日報 - 要聞港聞
        {'source_name': '聚言時報', 'url': 'http://polymerhk.com/feed'}, // 聚言時報
        // {'source_name': '香港電台網站', 'url': 'http://www.rthk.org.hk/rthk/news/rss/c_expressnews.xml'}, // 香港電台網站 - 即時新聞
        {'source_name': 'Goal.com', 'url': 'http://www.goal.com/hk/feeds/news?fmt=rss'}, // Goal.com News
        {'source_name': '紐約時報中文網', 'url': 'http://cn.nytimes.com/rss/zh-hant'}, // 紐約時報中文網 
        {'source_name': 'BBC 中文網', 'url': 'http://www.bbc.co.uk/zhongwen/trad/index.xml'}, // BBC 中文網
        {'source_name': 'Engadget 中文版', 'url': 'http://chinese.engadget.com/rss.xml'} // Engadget 中文版
    ],
    'IN': [
        {'source_name': 'NDTV - ताज़ातरीन', 'url': 'http://feeds.feedburner.com/ndtvkhabar'}, // NDTV - ताज़ातरीन
        {'source_name': 'NDTV - देश से', 'url': 'http://feeds.feedburner.com/Khabar-India'}, // NDTV - देश से
        {'source_name': 'Google News', 'url': 'https://news.google.com/news?pz=1&cf=all&ned=in&hl=in&output=rss'} // Google News
    ],
    'JP': [
        {'source_name': 'Yahoo トピックストップ', 'url': 'http://rss.dailynews.yahoo.co.jp/fc/rss.xml'}, // Yahoo トピックストップ
        {'source_name': 'Yahoo 国内', 'url': 'http://rss.dailynews.yahoo.co.jp/fc/domestic/rss.xml'}, // Yahoo 国内
        {'source_name': 'Google', 'url': 'https://news.google.com/news?hl=ja&ned=us&output=rss&topic=h'}, // Google - Top Stories
        {'source_name': 'NHK ニュース', 'url': 'http://www3.nhk.or.jp/rss/news/cat0.xml'}, // NHK ニュース
        {'source_name': 'excite', 'url': 'http://rss.excite.co.jp/rss/excite/odd'} // excite - 世界びっくりニュース
    ],
    'KR': [
        {'source_name': 'Google News', 'url': 'https://news.google.com.hk/news?pz=1&cf=all&ned=kr&hl=kr&output=rss'}, // Google News
        {'source_name': '경향신문', 'url': 'http://www.khan.co.kr/rss/rssdata/total_news.xml'} // 경향신문
    ],
    'RU': [
        {'source_name': 'Яндекс', 'url': 'http://news.yandex.ru/world.rss'}, // Яндекс.Новости - В мире
        {'source_name': 'Яндекс', 'url': 'http://news.yandex.ru/index.rss'}, // Яндекс.Новости - Главные новости
        {'source_name': 'РИА', 'url': 'http://ria.ru/export/rss2/world/index.xml'}, // РИА Новости
        {'source_name': 'Google News', 'url': 'https://news.google.com/news?pz=1&cf=all&ned=ru&hl=ru&output=rss'} // Google News
    ],
    'TW': [
        {'source_name': 'Yahoo 奇摩新聞', 'url': 'https://tw.news.yahoo.com/rss'}, // Yahoo 奇摩新聞
        {'source_name': '蘋果日報', 'url': 'http://www.appledaily.com.tw/rss/newcreate/kind/rnews/type/new'}, // 蘋果日報 - 即時新聞
        {'source_name': 'Google 新聞', 'url': 'https://news.google.com/news?pz=1&cf=all&ned=tw&hl=zh-TW&output=rss'}, // Google 新聞
        {'source_name': '聯合新聞網', 'url': 'http://udn.com/rssfeed/news/1/1?ch=news'}, // 聯合新聞網 - 即時 / 要聞
        {'source_name': '中時電子報', 'url': 'http://feeds.feedburner.com/chinatimes/realtimenews-focus'}, // 中時電子報 - 焦點
        {'source_name': 'Inside', 'url': 'http://feeds.feedburner.com/inside-blog-taiwan'}, // Inside 硬塞的網路趨勢觀察
        {'source_name': '紐約時報中文網', 'url': 'http://cn.nytimes.com/rss/zh-hant'}, // 紐約時報中文網
        {'source_name': 'BBC 中文網', 'url': 'http://www.bbc.co.uk/zhongwen/trad/index.xml'}, // BBC 中文網
        {'source_name': 'Engadget 中文版', 'url': 'http://chinese.engadget.com/rss.xml'} // Engadget 中文版
    ],
    // 'UK': [
    //     {'source_name': '', 'url': 'http://feeds.bbci.co.uk/news/uk/rss.xml'}, // BBC UK
    // ],
    'US': [
        {'source_name': 'BBC World', 'url': 'http://feeds.bbci.co.uk/news/world/rss.xml'}, // BBC World
        {'source_name': 'NYT International', 'url': 'http://www.nytimes.com/services/xml/rss/nyt/InternationalHome.xml'}, // NYT International
        {'source_name': 'Yahoo', 'url': 'https://news.yahoo.com/rss'}, // Yahoo - Latest News & Headlines
        {'source_name': 'Google News', 'url': 'https://news.google.com/?output=rss'} // Google News
    ]
}

function getNews(country, news_box, callback){

    /**
     *
     * 新聞來源指向：
     * 新加坡、馬來西亞 -> 台灣
     * 澳門 -> 香港
     * 加拿大、英國、其他 -> 美國
     *
    **/
    if (country === 'MO'){
        country = 'HK'
    } else if (country === 'SG' || country === 'MY'){
        country = 'TW'
    } else if (!(country in feed_list)){
        country = 'US'
    }
    var feed    = feed_list[country],
        len     = feed.length,
        pointer = 0,
        now    = new Date(),
        today   = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    function getNextNews(){

        var feedparser = new Feedparser(),
            req  = request(feed[pointer]['url']),
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
                if (item.date > today){
                    news.push({
                        'title': item.title,
                        'url'  : item.link,
                        'date' : item.date
                        // item.link.substr(item.link.indexOf('&url')+5)
                    })
                }
            }
        })
        feedparser.on('end', function (){

            if (pointer < len - 1){
                pointer ++
                news_box.push({
                    'source_name': feed[pointer]['source_name'],
                    'news': news
                })
                getNextNews()
            } else {
                callback(news_box)
            }
        })        
    }
    getNextNews()
}

module.exports = getNews