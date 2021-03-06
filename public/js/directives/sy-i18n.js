angular.module('ShinyaApp.i18nDirective', [])
.directive('syI18n', function (){
    return {
        restrict: 'E',
        replace : true,
        template: '<div id="i18n" class="bottom_left_corner general_animate">'
                +   '<div ng-repeat="item in langList" class="lang country general_animate general_box_shadow" ng-class="item.country" ng-click="changeLanguage(item.country)">'
                +       '{{item.lang}}'
                +   '</div>'
                + '</div>',
        controller: ['$scope', '$rootScope', '$timeout', '$translate', 'store', function ($scope, $rootScope, $timeout, $translate, store){

            var country_list = ['HK', 'CN', 'JP', 'TW', 'US', 'BR', 'IN', 'KR', 'RU', 'DE', 'FR'],
                language_list = [
                    {lang: '繁', country: 'HK', key: 'zh-HK'},
                    {lang: '简', country: 'CN', key: 'zh-CN'},
                    {lang: '日', country: 'JP', key: 'ja'},
                    {lang: '正', country: 'TW', key: 'zh-TW'},
                    {lang: 'EN', country: 'US', key: 'en'},
                    {lang: 'Pt', country: 'BR', key: 'pt'},
                    {lang: 'हिंदी', country: 'IN', key: 'hi'},
                    {lang: '한', country: 'KR', key: 'ko'},
                    {lang: 'Я', country: 'RU', key: 'ru'},
                    {lang: 'DE', country: 'DE', key: 'de'},
                    {lang: 'FR', country: 'FR', key: 'fr'}
                ],
                selectCountry = store.get('NG_TRANSLATE_COUNTRY') || 'HK',
                index = country_list.indexOf(selectCountry),
                selectLanguage = language_list[index]['lang'];
            $scope.langList = [{lang: selectLanguage, country: selectCountry}]
            $scope.changeLanguage = function (country){
                var lang_len = $scope.langList.length,
                    index = country_list.indexOf(country);
                if (country === $scope.langList[lang_len - 1]['country']){
                    // 顯示／切換「語言列表」
                    language_list.length === lang_len
                    ? hideLangList()
                    : showLangList()
                } else {
                    // 更改語言
                    $rootScope.$broadcast('$translateChangeBeforeStart')
                    $timeout(function (){
                        store.set('NG_TRANSLATE_COUNTRY', language_list[index]['country'])
                        $translate.use(language_list[index]['key'])
                    }, 1000)
                }
            }
            function showLangList(){
                for (var i = 0; i < language_list.length; i++){
                    var cache = $scope.langList,
                        len   = cache.length - 1;

                    cache[len]['lang'] !== language_list[i]['lang']
                    ? cache.unshift(language_list[i])
                    : null
                    $scope.langList = cache
                }
            }
            function hideLangList(){
                for (var i = 0; i < language_list.length; i++){
                    var cache = $scope.langList,
                        len   = cache.length - 1;

                    cache[len]['lang'] !== language_list[i]['lang']
                    ? cache.shift(language_list[i])
                    : null
                    $scope.langList = cache
                }
            }
        }]
    }
})