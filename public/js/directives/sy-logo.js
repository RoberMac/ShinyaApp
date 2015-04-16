angular.module('ShinyaApp.logoDirective', [])
.directive('syLogo', ['$timeout', function ($timeout){
    return {
        restrict: 'E',
        replace : true,
        template: '<div id="logo" class="general_animate" ng-show="isSubmit || !isMobile" ng-class="{\'logo_loaded\': isLogoLoaded}">'
                +     '<div class="vertically_center">'
                +         '<svg id="vivus_logo" viewBox="0 0 205 224" xmlns="http://www.w3.org/2000/svg">'
                +             '<g stroke="#000" fill="none">'
                +                 '<g>'
                +                     '<path id="shen" d="M169.35 70.387v.539c0 .154.693 1.001.847 1.155l1.54 1.54 1.155 1.463c.308.231.847.385 1.309.385.385 0 .847 0 .847-.539v-3.157c0-3.696-.154-7.238-.308-10.934 0-1.001.154-1.309-.154-2.156v-4.389c-.154-.462-.154-1.155-.154-1.617v-1.232c0-.154 0-1.155.616-1.155l.693.693.539.154c.154 0 1.001.693 1.155.847l.308.308.385.693c.616 1.001 1.463 1.848 2.156 2.695.154.154.847 1.001.847 1.001.154.154 1.463 1.463 1.617 1.694l.539.77.539.539.308.539 1.694 2.002 1.155 1.155.154.308c.154.154.539.847.539.847l.462.539c.385.308 1.848 2.002 2.002 2.31l.385.539c.308.462 1.309 1.463 2.002 1.463 3.003 0 5.852-.847 8.701-1.155.308-.154 1.001-.693 1.001-1.001v-.154c-.154-.539-.308-1.001-.847-1.155l-1.155-.231-.539-.154-.616-.154c-.539-.154-2.233-.847-2.387-.847l-1.001-.693-2.541-1.463c-.154 0-.462-.385-.616-.539l-.693-.616-1.001-.539c-.308-.154-1.848-1.309-2.156-1.54-.693-.616-3.542-3.619-4.235-4.312l-1.309-1.54-2.541-2.464-.308-.539c-.154-.154-.693-.847-.693-.847l-3.157-3.311c-.385-.385-.539-.539-.539-.847v-.231c1.386-1.155 2.541-1.001 4.235-1.155l1.001-.154 2.002-.154.462-.154c1.848-.154 3.696-.154 5.544-.539l.693-.154h1.155l1.001-.154h2.849c.847 0 1.694-.385 2.541-.539l2.31-.154c.231 0 .231-.154.231-.308 0-.847-2.541-2.387-2.849-2.849-.231-.154-.693-1.001-.847-1.232l-.693-.462c-.539-.539-.693-1.155-1.54-1.155h-.154l-.462.308c-.385.154-1.54 1.001-1.694 1.001-.154.154-1.386.693-1.694.847l-.462.154-.693.539-.847.154c-.154 0-1.309.462-1.54.462l-1.463.231-2.233.616-1.463.231-.539.154-.616.154c-1.232.154-2.233.462-3.388.693l-2.695.308h-.154c-.308 0-.462-.154-.693-.308v-.693c0-1.54 0-3.542.385-5.005l.308-.539.154-.539c-.462.231-.616 0-.616-.462 0-.847 1.001-1.386 1.001-2.156v-.231s-.385-.308-.539-.462l-1.001-.693-1.001-.462-1.001-.693-1.694-.847-1.155-.693h-.308c-.385 0-.693 0-.693.385v.154c.847 1.463 1.155 2.541 1.694 4.158l.616 2.002v.693l.154.539.231 1.001c.308.154.462.154.462.462 0 .385-.308.539-.308.847 0 .385.154.539.308.847 0 .539.154 2.387.154 2.849v.154c0 .154 0 .385-.154.385-2.31-.231-4.543.616-6.853 1.001l-.847.154c-.847.154-1.694.693-2.541.693h-2.156l-1.001.154-.308.154h-1.232l-3.157.462c-1.155.231-2.31.231-3.388.693v.154l.231.231 5.852 2.849h.154c1.001 0 1.694-.385 2.695-.693.847-.154 1.694-.308 2.541-.539 1.155-.308 2.31-.847 3.619-1.001h1.078l1.463-.308c.539 0 .693.693.693 1.155 0 .154-1.001 1.694-1.155 2.002-1.001 1.694-2.233 3.08-3.388 4.543l-.308.539-2.233 2.002c-1.309 1.463-2.464 2.849-4.004 4.158-.154.154-3.311 2.849-4.543 3.696l-.616.539c-1.694 1.309-2.695 2.31-4.543 3.465l-.693.385-1.001.847c-.154.154-1.309.616-1.54.616l-.616.539-1.694.847c-.154.154-.847.462-.847.847h-.847l-.308.308c-.539.308-1.386.308-1.848.693l-.308.308c-.385.154-.693-.693-.693-1.001 0-.462.308-.847.847-.847.462-1.001.616-2.31.847-3.542l.154-1.617c0-.231.616-.847.616-1.001.539-.847.385-1.848.693-2.695l.693-1.386s.154-.308.154-.462l.154-.847.539-.693c.462-.847.693-1.694 1.155-2.464 0-.231.539-.693.539-.847l.616-2.079.385-.462.154-1.001 1.001-3.003c.154-.693.154-1.232.462-1.694l.693-1.001s.154-1.386.308-1.848v-.154c0-.231.231-.847.231-.847l.847-1.694.308-1.694c0-.154.154-.616.154-.616.693-2.079 2.156-3.542 1.848-5.929.154-.154.154-.308.154-.462v-.385c0-.154-.154-.616-.154-.616h-.308s-.693 1.155-.847 1.617c-.847 1.694-1.386 3.388-2.002 5.082-.385.847-1.001 1.694-1.54 2.464l-.154.539-.539.539c-.462.77-1.155 2.002-1.463 3.003 0 .154-.385.847-.385.847-.462 1.155-1.309 2.002-2.002 3.157-.616 1.309-1.309 2.849-1.848 4.158-.154.693-.616 1.232-1.001 1.848l-.154.539c0 .154-.308.847-.462 1.001l-.539.847c-.539 1.155-.693 2.849-1.694 3.85-.308.308-1.463 1.54-1.848 1.848l-1.309-.539c-.308 0-.539.385-.539.539 0 2.156 1.232 3.696 2.233 5.39.154.154.847 1.617 1.001 1.848l1.001 1.463.462.847.539.154.462.539h.231c.77-.308 1.463-.154 2.31-.308 1.54-.539 2.695-1.386 4.004-2.079l1.694-.616c.154 0 .693-.385.693-.385l.308-.308 1.001-.308.539-.385c.154-.154.616-.462.847-.462.616-.385 1.155-.539 1.848-.847l1.309-.693 1.155-.847c1.386-.847 2.695-1.463 3.85-2.464.154-.231 1.386-1.232 1.54-1.386l1.309-1.001 1.232-1.001.308-.308c.154-.231 1.155-.693 1.309-.847l1.001-1.001.847-.693.385-.308 1.155-1.386.308-.308c1.54-1.54 3.003-2.849 4.389-4.543 0 0 .308-.693.693-.693.154 0 .308.539.308.693 0 .539.308 2.695.308 3.003v2.695l-.308 2.002v.385l.154.616v4.081c0 .462-.308 2.464-.308 3.003-.385 1.001-1.386 1.463-1.386 2.464zm-17.094-34.881c0 .231 0 .539.154.539h.231c.308 0 1.463-.308 1.463-.308.385-.231 1.386-.539 1.54-.693l2.156-1.694.693-.308c.154-.231 1.848-1.232 2.002-1.386l.693-.308.77-.847c.539-.539 1.232-.693 1.694-1.155.154-.154.847-1.001 1.001-1.001l.847-.231.154-.308 2.233-2.849.154-.308c1.001-1.386 2.156-2.695 3.311-4.081.539-.616 1.694-.77 1.694-1.771 0-.693-.462-1.232-1.001-1.54l-.154-.154c-.847-1.232-1.54-2.233-2.002-3.542.308-.308.847-1.001 1.309-1.001h3.696s.539.154.693.308c.462.385.308 1.54.308 1.848l.154.847v1.155l.385 2.541-.154 1.54v.154l.154.847v5.544l.308.616.154.539c.847 1.001 2.002 1.463 3.388 1.463 3.311 0 6.853-.308 10.241-.308 2.849 0 5.467.693 8.393.693.154 0 .462-.154.462-.154l.154-.231c0-.462-.308-1.001-.462-1.309-.154-.308-.693-1.155-.693-1.155l-1.694-1.694c-.308-.539-.847-1.309-1.463-1.309h-.231c-.308.154-1.617.462-2.002.616l-1.001.539-1.463.308-.539.154h-1.848l-.847.231h-2.849l-.616-.231h-.231c-.616 0-1.309.385-2.002.385-1.155 0-1.309-1.232-1.309-2.002v-3.927l-.154-3.157v-.308c0-1.232 1.463-1.386 1.463-2.387 0-.847-1.001-1.463-1.001-2.464v-.385c.693-.847 1.001-1.155 2.002-1.309.539 0 2.849-.385 3.234-.385h1.848c.154 0 .616-.308.847-.308h.308c.154 0 .308 0 .462.308h1.694c.385 0 .693.231.693.539 0 .308-.539.308-.693.693-.462.847-.154 1.463-.308 2.31 0 .154-.385 1.54-.385 1.848-.308 1.386-.77 2.387-.77 3.696h.462l.847-.847.539-.847.308-.462.693-1.386 2.156-3.311.154-.154 1.001-.693c.847-.693 3.003-2.541 3.003-3.388 0-.308 0-.308-.308-.616-.154-.231-1.309-1.386-1.694-1.848 0-.231-.308-.385-.308-.385l-.847-.462c-.847-.847-1.54-1.694-2.541-2.233h-.462c-1.001 1.232-2.002 2.387-3.234 3.234-.154.154-.462.308-.462.308l-1.155.154c-.231 0-.847.385-1.001.385-1.232.462-2.233 1.001-3.388 1.309-2.849.308-5.852.693-8.701 1.155l-1.848.539c-2.156.462-4.389.693-6.545.847l-2.695.462-1.694.154c-.154 0-.616.231-.847.231-.308 0-1.463-.231-1.848-.231l-.308-.77-.308-.693-.154-2.156c-.385-.847-1.54-1.848-1.848-2.849l-.385-1.078-.616-.616c-.539-.385-1.232-1.001-1.694-1.001 0 1.001.462 1.848.693 2.849l.154 2.31.308 1.848c0 2.387-.462 5.082-.847 7.392l-.308.847-.154 1.001c-.231.308-.693 1.694-.847 1.848-.847 1.309-2.233.847-2.233 2.31v.539c1.001 1.694 1.694 3.542 2.387 5.39 0 .154.308.154.462.154.847 0 .847-2.387 1.232-3.003.462-1.001.847-1.848 1.155-2.849 0-.231.462-.847.462-1.001l1.386-4.235c0-.154.154-.462.154-.462v-1.694c.154-.154.539-.693.847-.693l1.309-.154c.385 0 2.541-.539 2.849-.539h1.001c.231 0 1.078-.308 1.232-.308h.308c.539 0 .693.308 1.155.539.539.154 1.232.154 1.232.77l-.539 1.54v.539c0 .154-.308.77-.308 1.001l-.385 1.155c-.154.462-.847 2.002-.847 2.156l-.616.847-.385.693-.616.847-.231.462c-.616 1.386-1.617 2.541-2.618 3.696l-.385.308-.847.693c-.462.539-2.464 2.541-3.003 3.003-.693.539-.847.385-1.463 1.232l-.231.154c-.154 0-.77.462-1.001.462l-1.309 1.232-.693.462v.154zm-16.94 7.392c0 .385.154 1.386.539 1.386 1.155 0 1.001-1.848 1.155-2.541 0-.308.308-1.54.308-1.694.231-.693.693-1.463.847-2.156.539-1.54 1.232-3.003 1.848-4.543.385-.847 1.694-2.156 1.694-2.695 0-1.001-.847-1.309-1.54-1.694-.308-.154-.308-.616-.616-.847-.693-.462-1.54-.308-2.387-.462l-.154-.154c-.693-1.001-1.694-1.001-2.695-1.386-1.463-.154-3.311-.154-4.851-.462-.308 0-.693 0-.693.308 0 1.54 3.234 2.387 4.081 3.003l.462.539c.693.462 1.694.847 2.156 1.54.693.616.693 1.617 1.078 2.464v.154c0 .231-.385 1.232-.385 1.386-.154.847-.308 1.463-.308 2.464v1.386c-.154 1.309-.539 2.695-.539 4.004zm5.082-21.098l.308.308c.847 0 1.694-2.849 2.002-3.311.847-1.078 1.848-1.848 2.695-3.08l.462-.847c.231-.154 1.232-1.155 1.386-1.309.154-.154.154-.308.154-.539v-.154s-.308-.462-.462-.462c-.231-.154-.847-.539-.847-.539-.385-.154-1.232.154-1.54-.154l-.462-.693c-.847-.847-3.234-1.309-4.389-1.848-1.001-.462-2.002-1.001-3.003-1.309l-1.386-.308c-.847-.385-1.309-.847-2.156-.847-.539 0-.693.154-.693.616 0 1.386 2.233 2.387 3.234 2.849.616.385 1.617 1.001 2.31 1.54.693.539 1.001.847 1.694 1.54.693.847 1.155 1.309 1.155 2.31 0 1.694-.308 3.234-.462 4.851v1.386zm29.799 26.95c0-.154 0-.308.385-.308h.154l-.385.847c-.154 0-.154-.308-.154-.539zm-32.032-18.942l.154.154c0 .231-.308.231-.462.231 0-.231 0-.385.308-.385zm2.541 23.485c0-.154.154-.154.308-.154 0 .154 0 .539-.154.539l-.154-.231v-.154zm31.878 15.477c.154 0 .154.308 0 .308-.231 0-.231-.308 0-.308zm-2.541-56.056h.308c0 .154-.154.154-.308.154v-.154zm2.31 34.419c0 .154-.154.154-.154 0 0-.231.154-.231.154 0zm-33.495 12.012h.154v.231h-.154v-.231zm53.823-49.28c0 .154-.154.154-.154 0s.154-.154.154 0zm-11.088 31.878h.154v.154h-.154v-.154zm-48.433-34.727h.154v.154l-.154-.154z"/>'
                +                     '<path id="ye" d="M142.554 159.08c.77 1.309 1.848 2.849 2.849 4.004l.462.539.385.616.308.154s.462.231.693.231h.154c1.001 0 1.463-1.54 1.463-2.387l-.154-2.002c0-.308.154-.847.539-1.001h1.848s1.617-.539 2.31-.693c.154 0 .539-.154.539-.154l2.002-1.001c1.848-.693 3.85-1.155 5.544-2.002.847-.308 1.155-1.001 2.156-1.155.462-.385 2.849-1.848 3.388-2.233 0 0 .462-.308.616-.462l1.001-.847c1.001-.693 1.848-1.386 2.849-2.156h.539c.154.154 1.155.77 1.309 1.001.154.154 1.386.616 1.54.847 1.155.77 1.848 1.617 2.849 2.464l1.463 1.001c.847.539 1.54 1.386 2.387 1.848l.847.539c.462.308.693.847 1.001 1.155.693.539 1.309.693 2.002 1.155 1.155 1.232 2.31 2.387 3.696 3.234.308.154 1.001.616 1.001.616l.847.847s.462.154.693.154h.154c.462 0 .847-.154 1.155-.462 2.002-.539 3.85-1.155 5.852-1.54.539-.154 3.234-.462 3.696-.462.539-.385.693-.385.693-.847 0-1.001-1.386-1.001-2.002-1.001l-1.848-.154c-.693-.231-1.001-.693-1.694-.847l-1.848-.539-.539-.308c-.77-.385-1.617-.693-2.464-1.001l-.385-.154-.462-.385c-.154 0-1.309-.462-1.54-.462-.616-.385-1.155-.847-1.848-1.232-.616-.308-1.309-.308-1.848-.616-1.309-.847-2.31-2.233-3.85-2.695l-.462-.154c-.539-.154-2.387-1.232-2.695-1.386l-.693-.462-.847-.154-.616-.539c-.154 0-.539-.308-.539-.308-.693-.385-2.695-1.232-2.695-2.002v-.231c.385-.308 1.54-2.156 1.848-2.464l1.386-1.386.308-.462c.154-.154 2.002-2.002 2.156-2.233.231-.154.693-1.001.693-1.155l.154-.154.847-.693.154-.154 1.001-2.002.693-.847c.154-.308.847-1.001.847-1.155.462-.693.308-1.001 1.001-1.54l2.31-3.696.385-.616.847-1.232c0-.154.308-.847.462-1.001l.154-.462.693-1.001c.154-.231.847-1.848 1.001-2.002 0-.231.693-.693.693-.847.154-.385 0-.847.462-1.001.231 0 1.232-.385 1.386-.385l1.001-.308c.308-.154 1.001-.539 1.001-1.001 0-.154-.308-.693-.539-.847l-.462-.847-1.309-2.002-.539-.693c-.308-.693-.308-2.002-1.155-2.541h-.154c-.385 0-.693 0-1.001.231v1.001c0 .154-.385 1.155-.693 1.155l-.693-.154h-.154c-.539 0-.847.847-1.001 1.001-.847.847-2.156 1.848-3.388 2.156l-.847.154-.616.385s-.693.154-.847.154c-.154 0-2.156.308-2.387.308-.308 0-1.463.539-1.617.693-.231 0-.693.462-.693.693-.308-.385-.693-.385-1.001-.385-.693 0-1.155.154-1.694.154-.308 0-.693-.154-.693-.616l.385-.847c.154-.154.462-.847.462-1.001 0-.154.847-1.155.847-1.386.539-.847.539-1.155 1.155-2.002.693-.616 2.002-.154 2.002-1.463 0-.847-1.309-2.695-2.002-3.388-.462-.693-1.463-1.155-1.463-2.31v-.231c.462-1.155 1.463-1.001 2.464-1.001.231 0 1.232-.154 1.386-.154h2.464c.539 0 2.387-.154 2.695-.154l1.54-.308c.308 0 2.156-.385 2.695-.385l2.156-.154.539-.154h4.004l.693-.154h6.16c.154 0 .539-.154.693-.385v-.308c-.693-1.309-1.694-2.156-2.695-3.157l-.308-.385-.539-.616-2.156-2.233h-.385c-.462 0-.77 0-1.155.154l-1.001.847c-.847.539-1.848 1.386-2.849 1.54l-1.463.154-2.695.847c-.231 0-.847.154-1.001.154-.231 0-.693.385-.847.385l-1.848.154c-1.848.154-3.696.308-5.544 1.001h-.154c-.539 0-2.233.154-2.233.154l-.616.154h-1.232l-.462.154h-1.309c-.693 0-1.232.539-1.848.539-.385 0-.539-.154-.539-.539 0-1.001.308-1.848.539-2.695l.154-3.003c.154-.847 1.001-1.001 1.001-1.848 0-1.155-1.386-1.155-2.156-1.463-.231-.154-1.694-.847-1.848-1.001-.539-.385-1.001-.693-1.54-.847-.539-.154-.847-.154-1.309-.385l-2.079-1.001h-.462c-.308 0-1.386 0-1.386.539v.154c1.54.847 3.08 1.694 3.542 3.388 0 .154.539 1.463.539 1.848l.154.77c.308 1.001.847 1.694 1.001 2.695v.847l.154 1.694v.308c0 .154 0 .693-.308.847-4.004.693-8.239 1.001-12.243 1.386h-1.001c-.847 0-1.694.308-2.541.462l-2.002.154-.847.231c-.462 0-1.155-.231-1.694.154-.616 0-3.465.308-4.158.308h-1.155l-.693.154h-2.387l-1.309.385c-.154 0-.847.154-.847.154-1.001.154-2.156.154-3.157.154l-2.849-.154c-.847 0-1.155.308-1.155 1.309s3.619 1.848 4.466 2.002c.385.231.847.539 1.001.693.847.539 1.694.693 2.695.693h.539l1.001-.539c1.001-.308 2.31-.308 3.311-.462.231 0 1.694-.539 1.848-.539h1.232c.77 0 1.617-.308 2.464-.462l5.698-1.232h.154c.693 0 1.386.385 1.54 1.001-.539.847-.693 1.54-1.001 2.387-.308.847-.847 1.54-1.309 2.156-.385.539-.385 1.001-.693 1.54-.539.847-1.155 1.463-1.694 2.156-.154.385-1.001 1.386-1.001 1.386-1.001 1.155-2.156 2.464-3.157 3.696 0 0-.385.308-.539.462-.154.154-1.54 1.309-1.694 1.54l-.308.462s-.308.385-.539.539c-1.155 1.001-2.156 1.848-3.157 3.003l-1.001 1.155c-.693.693-3.157 3.388-3.542 3.696l-1.001.847c-.308.308-3.696 3.542-4.158 3.85-.385.308-.847.539-1.155 1.001 0 .154-.385.847-.539 1.001 0 .385.154.847.539.847.616 0 2.849-2.002 3.465-2.541.154-.154 1.232-1.001 1.54-1.155l.462-.308c.385-.385.693-.847 1.001-1.155l2.541-1.694 1.001-1.001.847-.539c.539-.308.847-1.001 1.309-1.463l1.386-1.001.693-.385c.308-.308.77-1.155 1.463-1.155.385 0 .693.462.693.847 0 .462.154 2.464.154 3.003l.539 1.309v.231c0 .462-.231 1.001-.231 1.617v.693l.231 1.001-.231.847v.308c0 .539.231 1.078.231 1.694 0 1.386-.231 2.541-.385 3.85 0 .385-.154 1.386-.154 1.54v2.31c0 .539-.154 2.387-.154 2.695l-.154.847v2.002c0 .154-.154 1.001-.154 1.232v1.617s-.693 1.232-.847 1.694c0 0-.385.308-.385.539 0 .154-.616.616-.616.847v1.155zm6.16-1.001c0-2.233 0-4.543-.154-6.545 0-.385-.154-1.848-.154-2.002l-.154-.693v-.154l.308-2.541c0-.308-.154-2.31-.154-2.695v-2.002c0-2.156.154-4.158.154-6.237 0-.77-.154-1.463-.154-2.31 0-1.001.154-2.156.308-3.157l.154-.385c.539-.847 1.001-1.309 1.001-2.464v-.385l-1.848-1.848c-.154-.154-.616-.462-.77-.462v-.385c0-.308.154-.616.462-1.001 1.001-1.155 2.695-2.002 3.85-3.003l1.848-1.694.847-.616.308-.539c.693-.847 1.694-1.309 2.541-2.156.308-.385 2.002-2.002 2.387-2.387l.308-.154 1.463-.154v-.308c0-.231 0-.539-.154-.847-.154-.385-1.001-1.848-1.155-2.002 0-.231-.847-.693-.847-.847-.154-.231-.154-.385-.154-.693 0-.539.308-1.001.847-1.155.154 0 1.463-.231 1.694-.231 2.464-.308 4.851-.616 7.315-.77h1.078l.462-.231c.847-.154 2.002-.308 2.849-.308.154 0 .308.154.539.308v.231c-.231 1.617-.385 3.85-.847 5.467l-.385.693c-.308.847-.462 1.694-.847 2.541l-.154.693s-.462.616-.616 1.001l-.539.616-.154.385v.847c-.154 1.001-.847 1.848-1.386 2.618-.154.231-.77 1.848-1.001 2.079l-.616.77c-.693 1.078-1.232 2.233-1.848 3.234l-.693 1.001c-.693 1.155-1.155 2.541-2.002 3.542-1.001 1.155-2.156 2.464-3.157 3.696 0 0-.385.462-.539.616-.154.154-1.309 2.002-1.54 2.233-.154.154-.154.154-.308.154h-.154c-.154-.154-1.386-.847-1.694-.847h-2.31c-1.001.308-2.387 1.001-2.387 2.156v.539l1.155.308c.385 0 3.08.847 3.388.847l1.155.154.693.385s.462.154.693.154l.77.154 2.079.693.77.154c.385.154 1.54.693 1.694.847l.847.616.308.231 1.078.308c.77.308 1.309.847 2.156 1.155l.847.154c.308.231.154.385.154.539 0 1.155-1.155 1.694-2.002 2.31-1.848 1.694-3.696 3.08-5.698 4.389-1.54 1.001-3.388 1.694-5.082 2.541-.77.308-1.463 1.001-2.31 1.309l-2.541 1.155c-.308.231-.847.847-1.309.847h-.154c-.154 0-.539-.308-.539-.462zm20.328-14.476c-.385-.308-1.54-1.463-1.848-1.848 0 0-.539-.154-.693-.308-.539-.154-1.848-.847-1.848-.847l-1.309-.308-.231-.154c-.308-.385-2.002-1.232-2.31-1.386l-.539-.154c-.462-.154-.616-.462-.616-1.001 0-.154 0-.308.154-.539l3.85-3.85c.462-.616 1.155-1.001 1.694-1.617l.308-.539 1.694-2.156c.308-.539.693-2.233 1.463-2.233l.385.231c.693 1.155 1.694 2.31 2.31 3.465l.154.847c.231.693.693 1.54 1.078 2.233l.308.462c.154.693 0 2.156 1.155 2.156.308 0 1.155-.308 1.386-.847l.154-.616c.308-.847 1.309-1.386 1.309-2.387v-.154c-.308-1.001-1.309-1.848-2.002-2.541l-.847-.77c-1.155-1.078-2.156-2.079-3.157-3.234 0 0-.693-.462-.693-.693v-.462c0-.847.539-1.386 1.001-2.156.154-.385.693-2.541 1.54-2.387 0 0 .462.154.616.308 1.001.539 1.848 1.232 3.08 1.232.616 0 1.617-.385 2.31-.539.308 0 1.386-.308 1.386-.308l.462-.385c.154 0 1.001-.308 1.309-.308.231 0 1.232-.154 1.386-.154.847-.154 1.694-.693 2.695-.693.308 0 .462.385.462.693 0 1.001-.616 2.156-1.155 3.003l-.539.539c-.462.616-.77 1.617-1.155 2.31-.616 1.386-1.309 2.387-2.156 3.542l-.154.308c-.385.693-.693 1.001-1.001 1.694l-.693 1.155-1.848 2.387-.154.308-.154.693s-.539.847-.693 1.155c-.308.539-1.001 1.001-1.001 1.694l.693.693c0 .308-.231.616-.539.616-.154 0-.154-.308-.462-.308-.847 0-.847.462-1.386 1.001l-1.309 1.309c-.154.231-1.001 1.386-1.232 1.54-.154.308-.616.693-1.001.693-.462 0-1.155-.154-1.617-.385zm8.547-40.733c.154-.308.616-.462 1.001-.462v.154l-.847.462-.154-.154zm-2.387 8.239c0-.154.154-.154.385-.154 0 .154 0 .462-.231.462l-.154-.154v-.154zm-4.004 34.727l.154-.154h.154l.154.154-.154.154h-.154l-.154-.154z"/>'
                +                     '<path id="comma" d="M160.88 209.66c0 2.464 1.848 4.466 4.235 4.62-1.078 4.004-4.466 6.16-5.39 6.776l.77 1.309c2.233-.77 9.394-4.851 9.625-12.32v-.385c0-2.541-2.079-4.62-4.62-4.62s-4.62 2.079-4.62 4.62z"/>'
                +                 '</g>'
                +                 '<g>'
                +                    '<path id="po" d="M17.093 75.931l.154.154h.539c1.001 0 1.309-.462 2.156-1.001l.847-.308c.154-.154 1.001-.539 1.001-.539.308-.154 1.001-1.001 1.155-1.309.385-.308 1.232-1.155 1.386-1.386l.693-.308.77-.847 1.694-1.309.154-.154 5.082-6.93c.154-.154.616-1.155.847-1.309l.462-1.001.539-.693c.462-1.001.847-2.156 1.155-3.311l.154-.385.308-.462 1.386-2.695s.154-.385.154-.539c0-.308.693-2.31.693-2.695.462-2.002 1.001-4.004 1.309-6.16v-.693l.847-3.003c0-.154.154-2.156.154-2.387l.154-.77c0-.693.693-5.929.693-6.545.154-.847.539-1.386.308-2.387.231-.154 1.232-.693 1.386-.693.308-.154 2.541-.616 3.003-.616h1.155c.847-.231 1.848-.539 2.695-.847.308-.154 1.386-.385 1.386-.385l.462.539.154 2.002.154.539v1.617c0 1.386.385 2.541.385 4.081l-.154.308v3.388l-.231.154s-1.463.308-2.002.462h-.616c-.231 0-1.386.539-1.54.539h-.154c-1.386.154-4.697.693-4.697.693l-.847.308c0 .308 3.003 2.156 3.696 2.31.462-.154 3.003-.462 3.542-.616l.462-.231c.308-.154 1.386-.308 1.386-.308h1.155l3.003-.847 1.155-.154c1.155-.308 2.387-.847 3.542-.847.693 0 1.309.693 1.309 1.155 0 .693-.308 1.54-.616 2.079l-.231.308c-.308 1.001-.308 1.694-.77 2.541-.231.154-1.001 1.309-1.001 1.463l-.385 1.155-.154.385-.308.462c0 .231-.539 1.54-.693 1.694 0 .154-.847 1.155-1.001 1.386-1.001 1.617-1.155 2.618-2.387 4.158-.308.308-.462.693-.847.693-.462 0-.616-.385-1.001-.693-.308-.154-1.155-1.155-1.309-1.309-.154-.385-2.002-2.387-2.156-2.695-.385-.539-1.232-.847-1.694-1.386l-.693-.847-1.155-1.309h-.308c-.539 0-.693.308-1.232.539l-1.001.308-.308.462c-.308.539-1.309.539-1.309 1.232 0 .308.154.308.462.462.154 0 1.309.539 1.54.539 1.001.462 1.848 1.309 2.464 2.156l.231.154c.616.539 1.155.385 1.617 1.001.693.847 1.386 1.232 2.233 2.002.154.231 1.463 1.232 1.617 1.386.385.154.539.693.539 1.155l-2.849 2.849c-.154 0-.847.539-1.001.693-.154.154-.693.847-.693 1.001 0 .154-.462.462-.693.693l-.462.308-1.386 1.155-3.003 2.002c-.154.231-.847 1.001-1.001 1.001-.154.231-1.463.693-1.694.847-.154.231-1.463.847-1.617 1.001l-.385.231c-.462.154-.616.154-1.155.462-.847.539-1.54 1.386-2.31 1.694l-.693.154-.539.308c-1.463.539-3.465.539-4.697 2.079h.231c1.771 0 3.311-.693 5.005-1.386l1.001-.308 1.001-.154 1.309-.693c.231 0 .847-.308 1.001-.308l1.078-.539c2.156-1.001 4.466-1.848 6.468-3.157l4.389-3.08c1.001-1.155 2.387-2.31 3.542-3.311.308-.385 1.155-1.001 1.155-1.001h.539c2.002 0 2.464 2.002 3.465 3.311 1.848 2.387 3.85 4.697 5.852 6.93.231.308.847 1.463 1.078 1.848.154.308.154.77.616.77h.693c1.54 0 3.157-.308 4.543-.616.616-.154 2.156-.693 2.31-.693.539-.154 2.849-.462 3.388-.462.154 0 .154-.231.154-.385 0-.847-1.54-.847-2.002-.847-.154 0-1.155-.308-1.386-.308l-.77-.154c-1.54-.539-2.695-1.155-4.081-1.848-.616-.385-1.309-.539-2.002-1.001-.308-.385-1.694-1.386-1.848-1.54l-1.463-1.001-.231-.154-.462-.693c-.154-.308-2.387-2.156-2.541-2.541l-.308-.462c-.154-.154-.539-.693-.539-.693-.308-.462-.308-.308-.847-.616-.77-.539-1.309-1.078-1.771-1.848l-.231-.385.231-.308c.154-.385 1.309-1.54 1.463-1.848.308-1.386.693-2.541 1.54-3.696l.462-.693.385-.616.77-1.078c.231-.154 1.078-2.156 1.232-2.31l1.463-1.694s.385-.308.385-.462c.462-.847.462-1.848 1.001-2.695l.847-1.155c.308-.385.462-1.386 1.001-1.54.847-.308 2.156-.308 2.849-.308 0-.539-.385-1.232-.539-1.54-.154-.539-.847-.539-1.155-1.001l-.154-.539c0-.154-.385-.462-.385-.462l-1.463-1.54-1.54-2.002c-.154-.154-.154-.154-.462-.154-1.232 0-1.54 1.155-2.541 1.54l-.847.154-.462.308c-.385.154-1.232.693-1.232.693l-.616.154c-.231 0-.539.154-.539.154l-1.309.693h-.385c-.308 0-.616 0-.616-.308v-.231c0-.462.154-1.848.154-2.002l.154-.847-.154-1.309v-2.849l.154-3.542c0-.154.308-.847.539-1.001 0 0 1.001-.539 1.309-.693.154 0 .462-.154.462-.154h.693l.847-.154h2.695c1.001-.693 2.156-.847 3.311-1.001h.385c.616 0 1.309.693 1.309 1.309 0 1.386-.308 2.387-.847 3.542-.308.847-.616.847-.616 2.002 1.309 0 1.848-1.463 2.464-2.464 0-.231.693-.693.693-.847l.308-.539.693-.462c.154-.231 1.694-1.54 2.002-1.848.154-.231.847-.847 1.001-1.001.539-.539 1.54-.539 1.848-1.386v-.308c0-.385.154-.539-.154-.693l-1.001-.693-.847-1.001-2.31-2.31c-.231-.154-.693-.847-.847-1.001-.154-.154-.539-.154-.693-.154-.847 0-2.156 2.464-2.849 3.003-.154.154-1.54 1.001-1.848 1.309-.693.539-1.694.539-2.31.693l-.693.308-1.155.154c-.539.231-.847.539-1.386.693h-.693l-.616.154h-.539c-1.309 0-1.309-1.617-1.309-2.464v-1.232c0-.154.154-1.617.154-1.848 0-.77-.154-1.309.154-2.002v-4.312l.539-.539c.462-.462.847-.308.847-1.001 0-1.54-2.695-2.695-3.696-3.388l-1.232-.616c-.77-.693-1.463-1.694-2.618-1.694v.847l.154.308.462 1.155s.154 1.078.154 1.386v.462l.539.693.154.308c0 .231.385.693.385.847v2.541s.154.539.154.693l.154.462v1.54c0 .154.308 1.309.308 1.54v.308l-.154 1.694c0 1.155 0 2.695.154 3.85l.154.462-.154.154-1.155.231-1.54.462-1.617.693c-.231 0-1.848.308-2.002.308-.231 0-.847.539-.847.539-.385 0-2.079.308-2.387.308l-.693.308h-.154c-.308 0-.462-.154-.462-.462l-.154-1.001c0-.154-.539-1.001-.693-1.386 0-.154-.693-.77-.693-1.001-.308-.462-.462-1.463-1.309-1.463-.154 0-.385 0-.385.154v1.54l.231 1.463v1.386c0 .154.154.77.154 1.001l-.154.308c0 .154-.231.847-.231.847v4.389c0 1.463-1.309 1.155-1.309 2.002 0 .462.462.616.462 1.155 0 .462.231 2.156.231 2.31 0 .231-.231 1.386-.385 1.694l-.308.847v1.155c0 .693-.154 3.08-.154 3.388-.154 1.155-.693 2.31-.847 3.542l-.154 1.309-.385 1.001c0 .154-.154.693-.154.693v.847c0 .154-.154.847-.308 1.001l-.385.693c-.154.462-.77 2.464-1.001 3.003 0 .154-.154.616-.154.847-.308.462-1.463 3.157-1.694 3.696-.308.77-.462 1.617-1.001 2.31l-1.155 1.155s-.308.847-.462 1.001l-.231.539c-.308.847-.616 1.309-1.155 2.002-2.156 2.849-4.543 5.544-7.392 7.7-1.001.847-1.848 2.002-3.003 2.695zm-5.544-15.785c0 1.232.539 2.233 1.232 3.08l.616.616.693 1.386.308.462.231.385.154.462c.154.308.308.308.462.308.539 0 1.155-1.155 1.155-1.463 0-.539-.616-.693-.616-1.155v-2.079l-.154-2.618c0-.231-.231-.847-.231-1.001v-.539c0-1.309.847-1.001 1.848-1.155.231 0 .847-.154.847-.154l1.155-.231.539-.308c1.309-.308 2.541-.308 3.85-.693.154 0 .693-.154.693-.154l1.155-.154 1.309-.693h1.232l1.001-.462 1.155-.154s.308-.231.308-.385c0-1.694-3.003-1.694-3.003-2.849v-.154l.154-.693.231-1.309.154-.693c.308-2.31.616-4.697 1.001-7.007 0-.385.616-3.234 1.155-3.388.539-.154 2.156-.154 2.156-.847v-.154c0-.154-.154-.462-.154-.462l-1.463-.847-3.234-3.234c-.847 0-.847.847-1.155 1.386l-1.001 1.155-.308.462-.231.231c-.847.154-2.156.308-3.003.847l-.308.308h-.539c-.154 0-.616.308-.847.308l-.847.154-.462.539c-.693.308-1.694.308-2.387.462-.154 0-.77.385-1.001.385h-.308l-.847-.847v-.154c0-.693.539-1.001.847-1.54l.847-1.463.462-.539c.231-.154.693-1.001.847-1.155.231-.154 1.694-1.694 1.848-1.848l.385-.693 1.155-1.155c.308-.385.462-1.386.847-1.848.616-1.001 1.309-1.694 2.002-2.695.308-.539.693-2.541 1.54-2.541h1.617c.154 0 .154-.308.154-.462v-.154c-.154-.385-.616-1.54-.77-1.694l-.539-.847c0-.154-.154-.308-.154-.308s.154-.385.308-.385l.693-.462 2.002-.154 1.155-.385c.154 0 2.002-.154 2.541-.154h2.541l.308-.154v-.693c-1.001-1.155-2.002-2.002-3.157-3.003-.539-.308-1.386-1.54-2.233-1.54-.616 0-.616 1.386-1.309 1.694l-.693.308c-.154.231-1.309 1.078-1.463 1.078h-1.848l-.693.154h-.847c-.847.154-2.002.847-2.695 1.001-1.463.308-3.542.616-5.005.847l-2.156.154c-.231 0-1.386.308-1.54.462-.847.231-4.543.539-5.39.539h-2.695c-.154 0-.154.154-.154.308 0 .847 1.232 1.232 1.848 1.54.385.154 1.155.693 1.386.693.616.462 1.309 1.309 2.156 1.309 1.001 0 2.002-.539 3.003-.693h.693l2.31-.616c1.848-.539 3.542-1.001 5.39-1.386h.154c.539 0 .693.693.693 1.155 0 .847-1.155 2.849-1.694 3.696l-1.309 2.695c-.539.385-.847 1.54-1.232 2.002-.308.693-.308 1.232-.77 1.848-.231.154-1.386 1.694-1.54 1.848l-.308.847-.693.693c-.154.308-.308 1.001-.847 1.001-.308 0-.462-.154-.693-.308l-1.155-1.386h-.154c0 1.386.693 2.541.693 3.696 0 .693-.847 1.694-1.386 2.387-.847 1.001-1.463 2.002-2.156 3.157l-.693 1.309-1.155 1.54-.154.462c-.539.693-1.386 1.078-1.848 1.694-.154.154-.693.847-.693.847 0 .154-.308 1.386-.308 1.848v.308s.462 2.233 1.001 2.079c.154 0 .308-.385.308-.385v-2.156s.385-.539.539-.693l2.156-2.464.539-.693c.308-.539 1.001-.847 1.463-1.386.539-.462 1.848-2.618 2.387-2.618h.154c.693.462.693 1.001.693 1.617.154 1.848.462 3.542.462 5.39l-.154 3.696c0 1.155.154 2.31.154 3.542v1.848c-.154.847-.693 1.617-.693 2.464zm2.695-18.403v-.385c.385-.462 1.155-.847 1.694-1.001l1.309-.308h1.386l.616-.308 2.079-.539c.308-.154 2.618-.847 3.157-1.001l.847-.308h.154c.154.154.539.462.539.462v.693l-.231 1.463v1.54l-.308 1.001v1.155c0 .231-.154.693-.154.847l-.154 1.694-.154.847c0 .539-.385 3.388-.693 3.542-.847.462-1.54.462-2.387.847-.154 0-.847.308-.847.308-.154 0-.462.154-.462.154l-1.001.154c-.539.231-1.694.847-2.156.847-.231 0-1.078-.154-1.232-.154-.308 0-.616-.308-.616-.693 0-.154-.385-1.617-.385-2.156-.308-2.156-.616-4.158-.847-6.391v-1.848l-.154-.462zm-5.544-11.627c0 .385.154.847.539 1.078v-.385c0-.308-.154-.693-.539-.693zm41.965 31.724h.154c0 .154 0 .308-.154.308v-.308zm17.248-41.272c.154 0 .154.154 0 .154s-.154-.154 0-.154z"/>'
                +                    '<path id="xiao" d="M28.566 136.365c0 .539 1.694 1.232 2.233 1.54.154 0 .616.693.847.693.154 0 .77.308 1.001.462h.154c.154 0 .616-.462 1.001-.616.154-.231 1.694-.693 1.848-.847l.308-.154.693-.539 1.309-.693c1.386-.616 3.003-1.309 4.235-2.156l.616-.693c.693-.462 1.694-.616 2.387-1.155.847-.539.847-.847 1.694-1.155l1.309-.539.539-.308c.154 0 .77-.385 1.001-.385.154-.154.847-.77 1.001-1.001h-.539c-.462 0-.693 0-1.001.231l-.847.77-1.309.231c-.693.154-1.54.462-2.156.616-.231 0-1.078.231-1.232.231-.462.154-.847.616-1.463.616h-.154s-.539-.462-.693-.616l-.385-2.387v-3.157c0-.154.385-.539.539-.693l2.002-.154.539-.154c1.001-.231 3.311-.385 4.004-1.232v-.154c0-.154-.154-.462-.154-.462l-2.233-2.233h-.154c-.847 0-1.694.847-2.31 1.232l-1.155.462-.385.154h-.154l-.539-.616c0-1.54-.308-3.08-.308-4.389 0-.847.308-.847 1.001-1.001 2.156-.693 4.543-1.54 6.699-1.694l2.002-.154c.539 0 1.848-.154 2.233-.308l.462-.385 1.001-.154.539-.154.308.154.539.308.462.231c.693.308.693 1.309.847 2.002l.308 1.155v2.156l.231.693v1.155c-.539 1.001-3.542.847-4.543 1.155l-1.001.385c-.154 0-1.155.154-1.386.154l-1.463.308-.385.231v.154c.539.847 1.848 2.31 2.849 2.31 2.079 0 3.696-1.155 5.698-1.155.385 0 .539.308.539.539l.154 1.463v4.235c-.308.462-1.309 1.001-1.848 1.155h-2.695l-2.618.847-1.078.154-1.309.308c0 .539.154.539.539.693.77.308 1.848.693 2.618 1.155l.693.539h.847l.847-.385c.462-.154 1.309-.308 2.002-.308.693 0 .693.308 1.54.308h.462c.539-.308.385-1.001 1.001-1.155h2.695l1.155-.308h1.386c.154 0 .616-.385.847-.385l2.002-.154c2.156-.154 4.312-.847 6.699-.616.154 0 .154-.231.154-.385v-.154c-.308-2.002-1.001-1.155-2.002-2.387l-1.001-1.309h-.385c-.616 0-1.155.308-1.771.539-.693.154-1.54.308-2.233.616l-.616.385h-1.078s-.308.154-.462.154c-.693.308-1.155.693-1.848.693-1.001 0-1.155-1.54-1.309-2.233l-.231-.462v-1.694l-.308-1.155v-.154l.539-.693.154-1.001c0-.154.308-.154.462-.154.539 0 .693.308 1.155.308.539 0 1.078-.308 1.54-.308l1.155-.231c.231 0 1.232-.308 1.386-.308.462 0 3.311-.154 3.85-.154l.462-.154c.231 0 1.54-.231 1.694-.231l.693-.154 1.155-.154.154-.154v-.154c-.154-.385-.462-1.001-.462-1.001l-2.695-2.695s-.308-.154-.539-.154c-.847 0-.847.462-1.463.847-1.155.462-2.695.616-3.85 1.155-.154 0-.539.154-.539.154-.847.154-1.463 0-2.156.308l-.847.539h-.154c-.385 0-.539-.154-.847-.308-.308-.231-.154-.385-.308-.693-.231-.385-.693-.154-.693-.693 0-.847 0-1.54.308-2.156l.539-.847v-.154c-.385-.154-1.54-1.386-1.694-1.694-.308-.308-.308-.308-.308-.693 0-.308.154-.308.462-.462l1.001-.385.693-.308.847-.154 1.155-.385h1.694l1.155-.308h.693c.847 0 1.463.154 2.156.154 0-1.001-.847-1.309-1.54-1.848-1.001-.616-1.771-2.156-3.157-2.156-.462 0-1.309.539-1.848.693-.847.154-1.463.154-2.31.616l-.539.385-1.155.154-1.001.308c-1.694.385-3.234.539-4.697 1.001h-.154l-.385-.308c.231-1.694-.308-3.157-.616-4.851v-.154c0-.693 1.309-.847 1.617-.847.231 0 1.386-.154 1.54-.154l.308-.231c.231-.154 1.001-.308 1.001-.308.231 0 1.694-.154 1.848-.154.385 0 2.387-.693 2.541-.693.154 0 1.54-.308 1.848-.308.847-.154 3.388-.539 3.696-.539h1.848l2.156-.308s.308-.308.539-.308c.154 0 1.309-.385 1.617-.385v-.462c-1.463-1.386-2.464-3.08-4.312-3.85-1.001 0-2.156 1.001-3.234 1.309-.154 0-.77.308-1.001.308-.154 0-.616.847-.847.847l-1.309.154-.308.231h-1.54l-3.311 1.155-1.232.154-.616.308s-1.386.231-1.848.231h-.154c-.385 0-.539-.385-.539-.693l-.154-2.387v-3.003c.154-.847 1.309-1.155 1.309-2.156 0-.154-.154-.539-.154-.539-.154-.308-1.309-1.463-1.694-1.617 0 0-.616-.385-1.001-.539l-1.463-.693c-.539-.154-1.232-.616-1.694-.616h-.847c-.308 0-1.54 0-1.54.462 0 .308 1.232 1.001 1.54 1.155.308.385.308.539.693.847l.462.693v1.54s.154.308.154.462c0 0 .385.693.385.847 0 .308.154 2.31.154 2.695 0 .693.308 1.309.462 2.002 0 .693-.154.693.231 1.309l.308.385v.154c-.308.462-.693.847-1.155.847l-3.234.308-2.464.847c-.385 0-2.849.308-3.542.308h-.539l-.462.231c-.539 0-2.541.308-3.003.308h-1.386c-.616 0-.462.693-1.617.847-.231 0-2.079.154-2.233.154-.308 0-.847.308-.847.847 0 .308 1.848 1.001 2.233 1.155l1.309.693c.539.154 1.54.154 2.156.154h.693c.308 0 2.156-.847 2.541-.847l3.157-.462.693-.231c.462-.154 1.001-.462 1.463-.462h1.232l1.001-.308h1.155l1.848-.385c.154 0 .154 0 .308.154.539.693.154 1.54.385 2.233 0 .154.154.847.154.847v.308c0 .154-.154 1.001-.154 1.001-.231.539-1.386.539-1.694.693l-.539.154-2.156.308c-1.155.154-2.156.693-3.388.847h-.77c-.231 0-.693.308-.847.308-.231 0-1.386.231-1.54.231l-1.155.462h-3.003c-.231 0-.539.385-.539.385v.308l.308.462.231.693c.154.539 1.001.154 1.309.385 0 0 .847.462 1.155.616.385.154.847.539 1.001.847.385.539.231 1.001.231 1.54l.308 1.848v1.155s.154.308.154.462l.154.385v.154l-.154.154c-.693.385-1.155.154-2.002.385l-1.155.308-2.387.154c-.154 0-.616.154-.847.154l-.462.385c-.385.154-1.848.462-2.233.462-.154 0-.154.385-.154.385 0 .616.847.616 1.386 1.001.308.154.462.77.847 1.001 0 0 .847.154 1.001.154h.308c.539 0 1.001-.154 1.54-.385l1.309-.308 1.001-.462h1.54c.462.308 1.001 1.463 1.001 2.156v1.001l.154.462v.385s-.154.693-.154.847c0 .847.154 1.463-.847 1.848-.154 0-2.156.462-2.387.462 0 0-.616.154-.77.385-.231 0-1.386.616-1.54.616-.308.154-3.157 1.001-3.542 1.232-.462.154-.847.308-.847.77zm-8.547 10.395c0 1.078.847 1.694 1.232 2.387l.308.693.847 1.001.308.847c.154.154.693 1.309.847 1.309h.154l.385-.154c.154-.154 1.155-1.155 1.309-1.386v-.308c0-.154 0-.308-.154-.693.154-3.311-.154-6.314-.385-9.702v-1.694c0-.154-.154-1.155-.154-1.463l-.154-1.001.154-1.232v-5.313c.154-.385.154-.539.154-.847v-.385c0-.154-.154-.77-.154-1.001v-8.008c-.154-.539-.154-1.001-.154-1.694 0-.539 0-1.001.154-1.54v-5.852c-.154-.308-.154-.462-.154-.847l1.001-4.004c0-.693-.154-.847-.462-1.309 0-.231-.539-1.001-.693-1.232-.539-.462-1.386-1.155-2.002-1.155-1.155 0-1.54 1.001-2.002 1.848-.385.539-.539.847-1.001 1.155-.847.847-2.233 1.386-3.388 1.694l-.847.154-.462.385c-1.001.462-2.079.847-3.234.847-.847-.693-.847-2.233-1.309-3.08-.385-.616-1.001-1.309-1.386-2.156l-.462-1.155c-.154-.385-.308-.154-.539-.154-.616 0-.847.308-.847.77 0 .693.693 1.848 1.078 2.695l.308.693s.154 1.155.154 1.694v.308l.308.847c0 .154.231 1.001.231 1.309v1.232l.154.462v2.387l.154.462c0 .154.154.693.154.693.154 1.694.308 3.388.539 5.005v.231c0 .616-.231 1.309-.231 1.771v1.078c0 .154.231.77.231 1.001.154 1.463.154 3.157.154 4.697v.77l-.154 3.927c-.231.616-1.386.616-1.386 1.309s.539 1.155.693 1.848c.154.308.462 1.848.462 2.156v.154c0 .385 0 1.386-.308 1.54-.693 0-1.155 0-1.848.154l-.693.385-2.156.154-.693.154-2.464.308-.154.231v1.309s.77 1.001 1.155 1.309c.308.385.847.231 1.155.385.847.462 1.54.616 2.387 1.155l.616.462c1.694 0 2.387-1.463 3.696-2.156l.847-.308.693-.693.462-.154 1.54-.847.847-.154.308-.154c.308-.385.154-.539.693-.847 1.155-.693 2.464-1.155 3.696-1.848.462-.385.616-.693 1.155-.847h.154c.154 0 .539.462.539.693v2.156l.154 1.001v.308l-.154 1.232c0 .154-.154.847-.154.847-.385.616-1.232.77-1.232 1.771zm4.543 17.171c.154.154.539.154.693.154h.462l.539-.154c.308-.231 1.848-.539 2.156-.539 1.001-.154 2.002-.308 3.003-.693 1.694-.616 3.234-1.309 4.851-2.002l.385-.154.847-.847 1.001-.616s.462-.385.462-.539l.385-.539 2.002-2.002.154-.308.154-.539.693-.616s.154-.385.154-.539l.154-.693c.154-.154 1.001-1.848 1.001-2.002l.154-1.463c0-.154.385-1.232.539-1.54l.154-.308.154-1.001c.231-.847 1.54-1.232 2.233-1.386l1.463-.154c.385 0 2.387-.693 2.695-.693h1.155c.231 0 .847-.308 1.001-.308h.385c.308 0 .616.308.616.693l.231 1.617.154.539v.308l-.154 2.079c0 .462.154 1.309-.231 1.771v6.237s.231.693.385 1.001c.154.539.847 2.002.847 2.002.154.385 1.155 1.386 1.463 1.54l.539.154.693.308c1.001.385 2.31.693 3.465.693h.385l5.467-.462h2.233c.154 0 .847-.231.847-.231.462 0 3.157-.462 3.696-.462l2.31-1.155c.693-.385 1.001-2.233 1.001-2.695 0-.693 0-1.386-.154-1.848 0-.154-.693-1.155-.693-1.386 0-.154-.154-.77-.154-1.001l-.154-.616c-.539-3.08-.539-6.391-.847-9.394l-.154-.385h-.154c-.231 0-.385.385-.385.385v3.157l-.462.539c0 .616-.385 3.465-.385 4.158l-.308 1.694v.154l.154.539c0 .308-.462.77-.693 1.155l-.154 1.001c-.154.308-1.309 1.463-1.617 1.694-.231 0-1.386.462-1.694.616-1.54.539-3.234.847-4.851.847h-1.848c-.231 0-.693.154-.847.154h-2.695c-.693-.154-1.155-1.155-1.309-1.617-.231-.385-.539-1.386-.539-1.54v-7.007c.539-1.694.539-3.388.847-5.082 0 0 .154-.693.308-.847l.693-.462.154-.154.308-.539s.693-.462.693-.693v-.616c0-.231-.847-.847-.847-1.001l-.308-.539-.539-.308c-.308-.231-1.463-1.386-1.617-1.694h-.231c-.616 0-.462.462-.77.847-.231.154-1.386 1.309-1.694 1.694-.385.308-.847.462-1.155.616-.231 0-1.386.847-1.54.847h-1.848c-.539.154-.693.539-1.155.693-.539 0-2.541.154-3.003.154h-.693c-.693 0-1.386-.847-1.694-1.54l-.847-1.617c-.154-.385-.462-1.232-1.001-1.232-.154 0-.462 0-.462.231v.616c0 .539 0 1.001.308 1.386v2.31c0 .154.154.847.154.847l-.462 1.54c0 .462.154 1.001.154 1.309 0 1.386-.154 2.849-.693 4.004 0 .231-.462.847-.462 1.001-.385.693-.231 1.54-.693 2.233-.154.154-1.386 1.463-1.54 1.694l-.154.308-.308 1.001c-.539.847-1.694 1.001-2.387 1.694l-.616.693c-.385.154-1.232 1.001-1.386 1.001l-1.001.308-.308.154c-.847.539-1.001 1.155-2.002 1.386l-1.078.154c-.154 0-1.309.308-1.463.462l-.539.385-.308.154-1.309.308c-.231 0-.539.308-.539.539zm-8.855-39.116l3.003-1.001 1.463-.154c.385-.154.385-.308.385-.539 0-.462-2.387-2.31-3.003-2.31-.693 0-2.233.462-2.695.847-.693.462-.847.847-1.694.847-.308 0-.539-.231-.693-.539v-3.696s-.154-1.001-.308-1.309l-.154-.539.154-.616c0-.231.154-1.078.154-1.078v-3.003c.308-.462 1.155-.616 1.54-.847.462-.154 1.309-.616 1.848-.847l1.155-.154 2.849-.616.462-.231h.385c.154 0 .693.231.693.385v7.007l.154.539c0 .308.154 1.309.154 1.463v2.849c0 .231.154.847.154.847v.154c0 .231 0 .385-.154.539v2.849c0 2.695 0 5.236.154 7.7l.154 1.848v1.54l-.308.308-1.155.154c-.693.231-1.386.693-1.848.847-.231 0-1.232.385-1.386.385-1.001.308-1.848.77-2.849.77-.616 0-1.155-1.309-1.155-2.002v-11.55c0-.847 2.002-.847 2.541-.847zm24.255-10.703c0-.154.231-.385.385-.385s.308 0 .308.231v.154c0 .154-.308.462-.308.462-.385 0-.385-.308-.385-.462zm-24.101 8.162c0-.154.154-.154.308-.154.385 0 .847 0 .847.385h-1.001l-.154-.231zm59.521 19.635c-.154-.154-.154 1.001 0 .847.154-.154.154-.616 0-.847zm-33.726-27.797l.154-.154.231.308-.231.154-.154-.154v-.154zm-17.402 49.588c-.154 0-.154.385 0 .385s.154-.385 0-.385zm23.793-59.521c.154 0 .308.154.308.385-.154 0-.308-.231-.308-.385zm14.245-3.003h.154v.308h-.154v-.308zm-40.733 7.392h.308v.154c-.154 0-.308 0-.308-.154zm2.31 54.978v.154h.231v-.154h-.231zm32.571-60.83l.154-.231v.385l-.154-.154z"/>'
                +                    '<path id="period" d="M31.8 212.74c0 4.312 3.388 7.7 7.7 7.7s7.7-3.388 7.7-7.7-3.388-7.7-7.7-7.7-7.7 3.388-7.7 7.7zm2.31 0c0-3.003 2.387-5.39 5.39-5.39 3.003 0 5.39 2.387 5.39 5.39 0 3.003-2.387 5.39-5.39 5.39-3.003 0-5.39-2.387-5.39-5.39z"/>'
                +                 '</g>'
                +             '</g>'
                +         '</svg>'
                +     '</div>'
                + '</div>',
        link: function (scope, elem, attr){
            new Vivus('vivus_logo', {type: 'delayed', pathTimingFunction: Vivus.EASE_IN}, function (){
                elem.find('g').css({
                    stroke: 'inherit',
                    fill  : '#000'
                })
                elem.next().css({
                    webkitTransition: 'all .7s ease-in-out',
                    transition      : 'all .7s ease-in-out'
                })
                scope.$apply(function (){
                    scope.isLogoLoaded = true
                })
                $timeout(function (){
                    elem.next().css({
                        webkitTransition: 'inherit',
                        transition      : 'inherit'
                    })
                }, 700)
            })
        }
    }
}])