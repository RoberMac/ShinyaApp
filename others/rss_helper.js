var zlib       = require('zlib'),
    Feedparser = require('feedparser'),
    iconv_lite = require('iconv-lite'),
    request    = require('request');

var feed_list = {
    'BR': [
        {'source_name': 'Yahoo Mundo', 'url': 'https://br.noticias.yahoo.com/mundo/?format=rss'}, // Yahoo Mundo
        {'source_name': 'G1', 'url': 'http://g1.globo.com/dynamo/brasil/rss2.xml'}, // G1 - Brasil
        {'source_name': 'R7', 'url': 'http://noticias.r7.com/brasil/feed.xml'}, // R7 - Brasil
        {'source_name': 'UOL Notícias', 'url': 'http://rss.uol.com.br/feed/noticias.xml'} // UOL Notícias
    ],
    'CN': [
        {'source_name': 'Google 新闻', 'url': 'https://news.google.com/news?cf=all&ned=cn&hl=zh-CN&output=rss'}, // Google 新聞
        {'source_name': '网易新闻', 'url': 'http://news.163.com/special/00011K6L/rss_sh.xml'}, // 網易新聞
        {'source_name': '新浪新闻', 'url': 'http://rss.sina.com.cn/news/china/focus15.xml'}, // 新浪新聞
        {'source_name': '华尔街见闻', 'url': 'http://wallstreetcn.com/rss.xml'}, // 華爾街見闻
        {'source_name': '纽约时报中文网', 'url': 'http://cn.nytimes.com/rss.html'}, // 紐約時報中文網
        {'source_name': 'BBC 中文网', 'url': 'http://www.bbc.co.uk/zhongwen/trad/index.xml'}, // BBC 中文網
        {'source_name': 'cnBeta', 'url': 'http://rss.cnbeta.com/rss'}, // cnBeta
        {'source_name': '湾区日报', 'url': 'http://wanqu.co/feed'}, // 灣區日報
        {'source_name': 'Engadget 中文版', 'url': 'http://cn.engadget.com/rss.xml'} // Engadget 中文版
    ],
    'DE': [
        {'source_name': 'SPIEGEL ONLINE', 'url': 'http://www.spiegel.de/schlagzeilen/tops/index.rss', 'encoding': 'Windows-1252'}, // SPIEGEL ONLINE - Schlagzeilen
        {'source_name': 'T-Online', 'url': 'http://feeds.t-online.de/rss/nachrichten'}, // T-Online
        {'source_name': 'Bild.de', 'url': 'http://rss.bild.de/bild.xml'}, // Bild.de
        {'source_name': 'Google News', 'url': 'https://news.google.com/news?pz=1&cf=all&ned=de&hl=de&output=rss'}, // Google News
        {'source_name': 'Yahoo nachrichten', 'url': 'https://de.nachrichten.yahoo.com/rss'} // Yahoo nachrichten
    ],
    'FR': [
        {'source_name': 'Le Monde', 'url': 'http://feeds.lefigaro.fr/c/32266/f/438191/index.rss'}, // Le Monde
        {'source_name': 'Google News', 'url': 'https://news.google.com/news?pz=1&cf=all&ned=fr&hl=fr&output=rss'}, // Google News
        {'source_name': 'L\'Equipe.fr', 'url': 'http://www.lequipe.fr/rss/actu_rss.xml'}, // L'Equipe.fr
        {'source_name': 'LE FIGARO', 'url': 'http://feeds.lefigaro.fr/c/32266/f/438191/index.rss'} // LE FIGARO
    ],
    'HK': [ 
        {'source_name': 'Google 新聞', 'url': 'https://news.google.com.hk/news?pz=1&cf=all&ned=hk&hl=zh-TW&output=rss'}, // Google 新聞
        {'source_name': 'Yahoo 新聞', 'url': 'https://hk.news.yahoo.com/rss/hong-kong'}, // Yahoo 新聞 - 港聞新聞
        {'source_name': '香港電台網站', 'url': 'http://www.rthk.org.hk/rthk/news/rss/c_expressnews.xml', 'encoding': 'BIG5'}, // 香港電台網站 - 即時新聞
        {'source_name': '東方日報', 'url': 'http://orientaldaily.on.cc/rss/news.xml'}, // 東方日報 - 要聞港聞
        {'source_name': '聚言時報', 'url': 'http://polymerhk.com/feed'}, // 聚言時報
        {'source_name': 'Goal.com', 'url': 'http://www.goal.com/hk/feeds/news?fmt=rss'}, // Goal.com News
        {'source_name': '紐約時報中文網', 'url': 'http://cn.nytimes.com/rss/zh-hant'}, // 紐約時報中文網 
        {'source_name': 'BBC 中文網', 'url': 'http://www.bbc.co.uk/zhongwen/trad/index.xml'}, // BBC 中文網
        {'source_name': 'Engadget 中文版', 'url': 'http://chinese.engadget.com/rss.xml'} // Engadget 中文版
    ],
    'IN': [
        {'source_name': 'The Times of India', 'url': 'http://dynamic.feedsportal.com/pf/555218/http://toi.timesofindia.indiatimes.com/rssfeedstopstories.cms'}, // The Times of India
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
        {'source_name': '이티뉴스', 'url': 'http://rss.etnews.com/Section902.xml'}, // 이티뉴스
        {'source_name': 'dongA.com', 'url': 'http://rss.donga.com/total.xml'}, // dongA.com
        {'source_name': '경향신문', 'url': 'http://www.khan.co.kr/rss/rssdata/total_news.xml'} // 경향신문
    ],
    'RU': [
        {'source_name': 'Яндекс', 'url': 'http://news.yandex.ru/world.rss'}, // Яндекс.Новости - В мире
        {'source_name': 'Яндекс', 'url': 'http://news.yandex.ru/index.rss'}, // Яндекс.Новости - Главные новости
        {'source_name': 'РИА', 'url': 'http://ria.ru/export/rss2/world/index.xml'}, // РИА Новости
        {'source_name': 'Google News', 'url': 'https://news.google.com/news?pz=1&cf=all&ned=ru&hl=ru&output=rss'} // Google News
    ],
    'TW': [
        {'source_name': '蘋果日報', 'url': 'http://www.appledaily.com.tw/rss/newcreate/kind/rnews/type/new'}, // 蘋果日報 - 即時新聞
        {'source_name': 'Google 新聞', 'url': 'https://news.google.com/news?cf=all&ned=tw&hl=zh-TW&output=rss'}, // Google 新聞
        {'source_name': '聯合新聞網', 'url': 'http://udn.com/rssfeed/news/1/1?ch=news'}, // 聯合新聞網 - 即時 / 要聞
        {'source_name': '中時電子報', 'url': 'http://feeds.feedburner.com/chinatimes/realtimenews-focus'}, // 中時電子報 - 焦點
        {'source_name': 'Inside', 'url': 'http://feeds.feedburner.com/inside-blog-taiwan'}, // Inside 硬塞的網路趨勢觀察
        {'source_name': '紐約時報中文網', 'url': 'http://cn.nytimes.com/rss/zh-hant'}, // 紐約時報中文網
        {'source_name': 'BBC 中文網', 'url': 'http://www.bbc.co.uk/zhongwen/trad/index.xml'}, // BBC 中文網
        {'source_name': 'Engadget 中文版', 'url': 'http://chinese.engadget.com/rss.xml'} // Engadget 中文版
    ],
    'US': [
        {'source_name': 'BBC World', 'url': 'http://feeds.bbci.co.uk/news/world/rss.xml'}, // BBC World
        {'source_name': 'CNN', 'url': 'http://rss.cnn.com/rss/cnn_topstories.rss'}, // CNN.com - Top Stories
        {'source_name': 'NYT International', 'url': 'http://www.nytimes.com/services/xml/rss/nyt/InternationalHome.xml'}, // NYT International
        {'source_name': 'Yahoo', 'url': 'https://news.yahoo.com/rss'}, // Yahoo - Latest News & Headlines
        {'source_name': 'Google News', 'url': 'https://news.google.com/?output=rss'}, // Google News
        // Tech
        {'source_name': 'Hacker News', 'url': 'http://hnrss.org/newest'}, // Hacker News: Newest
        {'source_name': 'WIRED', 'url': 'http://feeds.wired.com/wired/index'}, // WIRED
        {'source_name': 'Re/code', 'url': 'https://recode.net/feed/'}, // Re/code
        {'source_name': 'Designer News', 'url': 'https://news.layervault.com/?format=rss'}, // Designer News
        {'source_name': 'The Verge', 'url': 'https://www.theverge.com/rss/index.xml'} // The Verge
    ]
}
function updateCountryNews(country, now, news, callback){

    var list = {
        'BR': {'BR': news},
        'CN': {'CN': news},
        'DE': {'DE': news},
        'FR': {'FR': news},
        'HK': {'HK': news},
        'IN': {'IN': news},
        'JP': {'JP': news},
        'KR': {'KR': news},
        'RU': {'RU': news},
        'TW': {'TW': news},
        'US': {'US': news}
    }
    if(!(country in list)){
        log.warning('[News: Not Found]', country)
        return;
    }
    News.findOneAndUpdate({date: now}, list[country], function (err){
        if (err) {
            log.error('[DB: Not Found]', err)
            return;
        }
        log.info('[News: Saved]', country)
        callback()
    })
}
// via https://github.com/danmactough/node-feedparser/blob/master/examples/compressed.js
function decompressRes (res, encoding) {

    var decompress;

    encoding.match(/\bdeflate\b/)
    ? decompress = zlib.createInflate()
    : encoding.match(/\bgzip\b/)
        ? decompress = zlib.createGunzip()
        : null

    return decompress ? res.pipe(decompress) : res
}
function getNews(frequency){

    var now = new Date(),
        now = Date.UTC(
            now.getUTCFullYear(),
            now.getUTCMonth(),
            now.getUTCDate(),
            now.getUTCHours()
        ),
        restrict = now - frequency;
    News.findOne({date: now}, function (err, found){
        if (found){
            log.info('[News: Existed]', now)
            return;
        }
        log.info('[News: Start Fetch]', now)
        var news = new News({
            date: now
        })
        news.save(function (err){
            if (err){
                log.error('[DB: Save Error]', err)
                return;
            }
            log.info('[DB: Start Fetch]', now)
            var country_list    = Object.keys(feed_list),
                country_len     = country_list.length,
                country_pointer = 0;

            (function getCountryNews(country){

                var feed_item    = feed_list[country],
                    feed_len     = feed_item.length,
                    feed_pointer = 0,
                    all_news     = [];
                (function getNextNews(){

                    var feedparser = new Feedparser(),
                        encoding = feed_item[feed_pointer]['encoding'] || 'UTF8'
                        cache        = [];

                    // 抓取當前新聞源
                    request({
                        url: feed_item[feed_pointer]['url'],
                        gzip: true,
                        timeout: 10000,
                        headers: {
                            'accept': 'text/html,application/xhtml+xml',
                            'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.90 Safari/537.36'
                        },
                        pool: false
                    })
                    .on('error', function (err){
                        log.error('[News: Request Error]', feed_item[feed_pointer]['source_name'], err)
                        // 若不是「新聞列表」最後的新聞源，獲取下一個新聞源新聞
                        if (feed_pointer < feed_len - 1){
                            feed_pointer ++
                            getNextNews()
                        } else {
                            log.info('[News: Fetch & Parse Finished]', country)
                            updateCountryNews(country, now, all_news, function (){
                                if (country_pointer < country_len - 1){
                                    country_pointer ++
                                    getCountryNews(country_list[country_pointer])
                                } else {
                                    log.info('[News: Done]', now)
                                }
                            })
                        }
                    })
                    .on('response', function (res){
                        if (res.statusCode != 200){
                            return this.emit('error', new Error('Bad status code', res.statusCode))
                        }
                        decompressRes(res, res.headers['content-encoding'] || '')
                        .pipe(iconv_lite.decodeStream(encoding))
                        .pipe(feedparser)
                    })

                    // 解析當前新聞源
                    feedparser
                    .on('error', function(err){
                        log.warning('[News: Parse Error]', feed_item[feed_pointer]['source_name'], err)
                    })
                    .on('readable', function(){
                        var stream = this,
                            meta = this.meta,
                            item;
                        while (item = stream.read()){
                            item.date < now && item.date > restrict
                            ? cache.push({
                                'title': item.title,
                                'url'  : item.link,
                                'date' : item.date
                            })
                            : null
                        }
                    })
                    .on('end', function (){
                        // 若不是「新聞列表」最後的新聞源，獲取下一個新聞源新聞
                        if (feed_pointer < feed_len - 1){
                            cache.length > 0
                            ? all_news.push({
                                'source_name': feed_item[feed_pointer]['source_name'],
                                'news': cache
                            })
                            : null
                            feed_pointer ++
                            getNextNews()
                        } else {
                            if (cache.length > 0){
                                all_news.push({
                                    'source_name': feed_item[feed_pointer]['source_name'],
                                    'news': cache
                                })
                            }
                            log.info('[News: Fetch & Parse Finished]', country)
                            updateCountryNews(country, now, all_news, function (){
                                if (country_pointer < country_len - 1){
                                    country_pointer ++
                                    getCountryNews(country_list[country_pointer])
                                } else {
                                    log.info('[News: Done]', now)
                                }
                            })
                        }
                    })
                })()
            })(country_list[country_pointer])
        })
    })
}

module.exports = function (frequency){
    // 每隔一小時抓取一次，每隔一分鐘檢測是否需要抓取
    getNews(frequency)
    setInterval(function (){
        getNews(frequency)
    }, 1000 * 60 * 5)
}