angular.module('ShinyaApp.imgDirective', [])
.directive('syImg', function (){
    return {
        restrict: 'E',
        replace : true,
        template: '<div id="img_box" ng-class="{\'me\': isImgBoxRight}">'
                +   '<ul>'
                +       '<li ng-repeat="url in now_img_list" class="general_animate">'
                +           '<img ng-src="{{url.thumbnail}}" ng-class="{\'zoom_out\': isZoomIn && $index === now_zoom_id}" ng-click="toggleImageSize(url.bmiddle, $index)" sy-imageonload>'
                +       '</li>'
                +   '</ul>'
                + '</div>',
        controller: ['$scope', '$timeout', function ($scope, $timeout){
            /*
             **************
             * 圖片消息相關
             **************
             * 
             *  `$scope.isZoomIn`：圖片是否放大
             *  `$scope.isImgBoxRight`：`img_box` 是否右浮
             *  `$scope.isImageLoaded`：大圖是否已經加載完畢
             *  `$scope.img_list`：存儲消息中所有的圖片消息
             *  `$scope.now_img_list`：現在閱覽中的消息中中的圖片
             *  `$scope.now_zoom_id`：現在閱覽中的圖片的 $index
             *  `$scope.imgURL`：現在閱覽中的大圖的 URL
             *  `$scope.toggleImgBox`：處理顯示／隱藏 `img_box`
             *  `$scope.toggleImageSize`：處理打開／關閉大圖
             *
             */
            $scope.isZoomIn = false
            $scope.isImgBoxRight = false
            $scope.isImageLoaded = false
            $scope.img_list = {}
            $scope.now_img_list = []
            $scope.now_zoom_id = -1
            $scope.imgURL = ''
            $scope.toggleImgBox = function (isMe, id){
                $scope.isImgBoxRight = isMe
                $scope.now_img_list = $scope.img_list[id] || []
            }
            $scope.toggleImageSize = function (url, id){
                if (url && id !== $scope.now_zoom_id){
                    // 切換大圖時，先 DOM 移除元素，再重新 DOM 插入元素
                    // 使 `syImageonload` Directive 重載
                    $scope.isZoomIn = false
                    $timeout(function (){
                        $scope.isZoomIn = true
                    })
                    $scope.imgURL = url
                    $scope.now_zoom_id = id
                    $scope.isImageLoaded = false
                } else {
                    $scope.isZoomIn = false
                    $scope.now_zoom_id = -1
                }
            }
        }]
    }
})