angular.module('ShinyaApp.notifyDirective', [])
.directive('syNotify', function (){
    return {
        restrict: 'A',
        link: function (scope, elem, attr){
            scope.$watch('isMsgNotify', function (newVal){
                elem.removeClass('submit_animate')
                elem.attr('type', 'button')
                if (newVal){
                    // elem.removeAttr('type')
                    if (scope.errMsg){
                        elem.addClass('error_msg')
                        elem.attr('value', scope.errMsg)
                    } else if (scope.okMsg){
                        elem.addClass('ok_msg')
                        elem.attr('value', scope.okMsg)
                    } else {
                        console.error('[TypeError]: Not `error` or `ok`')
                    }
                } else {
                    elem.removeClass('error_msg ok_msg').addClass('submit_animate')
                    elem.attr({
                        'type' : 'submit',
                        'value': attr.value
                    })
                }
            })
        }
    }
})