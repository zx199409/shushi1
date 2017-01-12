/**
 * Created by qingyun on 16/12/2.
 */
//<div class="slideBottomDiv"></div>
angular.module('cftApp.slideBox',[]).directive('mgSlideBox',[function () {
    return{
        restrict:"E",
        scope:{sourceData:'='},
        template:'<div class="topCarousel"><ion-slide-box delegate-handle="topCarouselSlideBox" auto-play="true" does-continue="true"  slide-interval="3000" show-pager="true" on-drag="drag($event)"  ng-if="isShowSlideBox"><ion-slide ng-if="sourceData.ishome == 0 || sourceData.ishome == 1" ng-repeat="ads in sourceData.bannerData track by $index" ng-click="goToDetailView(ads)"><img ng-src="{{iconRootUrl + ads.image_url}}" class="topCarouselImg"></ion-slide><ion-slide ng-if="sourceData.ishome == 2" ng-repeat="imgUrl in sourceData.bannerData track by $index"><img ng-src="{{iconRootUrl + imgUrl}}" class="topCarouselImg"></ion-slide></ion-slide-box><p></p></div>',
        controller:['$scope','$element','$ionicSlideBoxDelegate','$ionicScrollDelegate','$state','$ionicViewSwitcher','$rootScope',function ($scope,$element,$ionicSlideBoxDelegate,$ionicScrollDelegate,$state,$ionicViewSwitcher,$rootScope) {
            //通过 sourceData.instegral 区分进入的详情
            $scope.iconRootUrl = IconROOT_URL;
            $scope.goToDetailView = function (item) {
                if ($scope.sourceData.ishome == 0) {
                    console.log("home->icon_detail");
                    $state.go('tabs.goodsDetail',{goods_id: item.param});
                }else{
                    $state.go('tabs.igDetail',{goods_id: item.param});
                }
                $ionicViewSwitcher.nextDirection('forward');
            };
            
            $scope.$watch('sourceData.bannerData',function (newVal,oldVal) {
                
                if (newVal && newVal.length){
                    // console.log($scope.sourceData);
                    // console.log("new");
                    // console.log(newVal);
                    $ionicSlideBoxDelegate.$getByHandle('topCarouselSlideBox').update();
                    $ionicSlideBoxDelegate.$getByHandle('topCarouselSlideBox').loop(true);
                }
            });
            // $scope.sourceArray = [{imgsrc:'images/testImg.png',title:'轮播产品1'},{imgsrc:'images/myOrder.png',title:'轮播产品2'},{imgsrc:'images/testImg.png',title:'轮播产品3'},{imgsrc:'images/myOrder.png',title:'轮播产品4'},{imgsrc:'images/testImg.png',title:'轮播产品5'}];
            // $scope.$watch('sourceArray',function (newVal,oldVal) {
            //     if (newVal && newVal.length){
                    /*
                    * 两种方案解决轮播不能立刻显示或者显示错位的bug 改bug由于ng-repeat和slideBox的特性造成
                    * 完美的解决方案是使用添加ng-if 另一种是用update 和 loop
                    * */
                    $scope.isShowSlideBox = true;
                    // $ionicSlideBoxDelegate.$getByHandle('topCarouselSlideBox').update();
                    // $ionicSlideBoxDelegate.$getByHandle('topCarouselSlideBox').loop(true);
                    // lastSpan.innerText = $scope.sourceArray[0].title;
            //     }
            // });
            // $scope.slideHasChanged = function (index) {
                // lastSpan.innerText = $scope.sourceArray[index].title;
            // };
            //页面刚加载出来的时候禁止滑动
            // $ionicSlideBoxDelegate.$getByHandle('mainSlideBox').enableSlide(false);
            // //拖拽轮播图的时候也要禁止底层的slideBox滑动
            // $scope.drag = function (event) {
            //     $ionicSlideBoxDelegate.$getByHandle('mainSlideBox').enableSlide(false);
            //     //阻止事件冒泡
            //     event.stopPropagation();
            // };

        }],
        replace:true,
        link:function (scope,tElement,tAtts) {
        }
    };
}]);