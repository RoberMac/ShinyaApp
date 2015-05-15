angular.module('ShinyaApp.imgDirective', [])
.directive('syImg', function (){
    return {
        restrict: 'E',
        replace : true,
        template: '<div ng-if="now_img_list.length > 0" id="img_box" class="general_animate" ng-class="{\'me\': isImgBoxRight, \'mobile\': isMobile}">'
                +   '<ul>'
                +       '<li><span class="close_img_box general_box_shadow general_animate" ng-click="toggleImgBox({isMe: false}); toggleImageSize()"></span></li>'
                +       '<li ng-repeat="url in now_img_list" class="general_animate">'
                +           '<img class="general_box_shadow general_animate" ng-src="{{url.small}}" ng-class="{\'zoom_out\': isZoomIn && $index === now_zoom_id}" ng-click="toggleImageSize(url, $index)" sy-imageonload>'
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
            $scope.toggleImgBox = function (obj, index){
                var isMe = obj.isMe,
                    id   = obj.date,
                    isSameList = $scope.now_img_list == $scope.img_list[id],
                    isEmptyList = angular.equals($scope.now_img_list, []),
                    now_img_list = index >= 0
                        ? $scope.img_list[id].slice(index, index + 1)
                        : $scope.img_list[id];

                if (!isSameList && isEmptyList){
                    // 現在不存在已打開的圖片預覽，直接打開
                    $scope.isImgBoxRight = isMe
                    $scope.now_img_list = now_img_list
                } else if (!isSameList && !isEmptyList){
                    // 現在存在已打開的圖片預覽，先關閉，再打開
                    $scope.now_img_list = []
                    $timeout(function (){
                        $scope.isImgBoxRight = isMe
                        $scope.now_img_list = now_img_list
                    }, 717)
                } else {
                    // 關閉圖片預覽
                    $scope.now_img_list = []
                }
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