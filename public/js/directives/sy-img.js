angular.module('ShinyaApp.imgDirective', [])
.directive('syImg', function (){
    return {
        restrict: 'E',
        replace : true,
        template: '<div id="img_box">'
                +   '<ul>'
                +       '<li ng-repeat="url in now_img_list" class="general_animate">'
                +           '<img ng-src="{{url.thumbnail}}" ng-class="{\'zoom_out\': isZoomIn}" ng-click="toggleImageSize(url.bmiddle)">'
                +       '</li>'
                +   '</ul>'
                + '</div>',
        controller: ['$scope', function ($scope){
            /*
             **************
             * 圖片消息相關
             **************
             *  
             *  
             *
             */
            $scope.isZoomIn = false
            $scope.img_list = {}
            $scope.now_img_list = []
            $scope.imgURL   = ''
            $scope.isImageLoaded = false
            $scope.toggleImageSize = function (url){
                if (url){
                    $scope.imgURL = url
                    $scope.isZoomIn = true
                    $scope.isImageLoaded = false
                } else {
                    $scope.isZoomIn = false
                }
            }
        }]
    }
})