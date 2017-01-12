/**
 * Created by qingyun on 16/11/30.
 */
angular.module('cftApp.personal',[]).config(['$stateProvider',function ($stateProvider) {
    $stateProvider.state('tabs.personal',{
        url:'/personal',
        views:{
            'tabs-personal':{
                templateUrl:'personal.html',
                controller:'personalController'
            }
        }
    });
}]).controller('personalController',['$scope','$rootScope','$state','$ionicViewSwitcher','$ionicModal',function ($scope,$rootScope,$state,$ionicViewSwitcher,$ionicModal) {

    $scope.$on('$ionicView.beforeEnter', function () {
        $rootScope.hideTabs = false;
    });
    $scope.personal = {

        userName:'你还想我吗？',
        creditNum:'3800',
        showOrder:showOrder,
        //进入订单
        showCollect:showCollect,
        //进入收藏
        showShoppingCar:showShoppingCar,
        //进入购物车
        showCredit:showCredit,
        //进入积分页面
        showAddress:showAddress,
        //进入收货地址页面
        showPay:showPay,
        //进入支付记录页面
        showAttention:showAttention,
        //进入关注页面
        share:share
        //打开分享提示模态
    };
    function showOrder() {
        $state.go('tabs.myOrder');
        $ionicViewSwitcher.nextDirection("forward");
        console.log('进入我的订单页面')
    }
    function showCollect() {
        console.log('进入我的收藏页面');
            $state.go('tabs.collectionPager');
            $ionicViewSwitcher.nextDirection("forward");
    }
    function showCredit() {
        console.log('进入我的积分页面');
        $state.go('tabs.totalScore');
        $ionicViewSwitcher.nextDirection('forward');
    }
    function showShoppingCar() {
        console.log('进入购物车页面');
        $rootScope.hideTabs = true;
        $state.go('tabs.shoppingCart');
        $ionicViewSwitcher.nextDirection("forward");
    }
    function showAddress() {
        console.log('进入收货地址页面');
        $state.go('tabs.receiptAddress');
        $ionicViewSwitcher.nextDirection('forward');
    }

    function showPay() {
        console.log('进入我的支付记录页面');
        $state.go('tabs.payRecord');
        $ionicViewSwitcher.nextDirection('forward');
    }
    function showAttention() {
        console.log('进入关注页面')
    }

    $ionicModal.fromTemplateUrl('shareModal.html',{
        scope:$scope,
        animation:'fade-in'
    }).then(function (modal) {
        $scope.modal = modal;
    });

    function share() {
        $scope.modal.show();
    }

    $scope.$on('$destroy',function () {
        $scope.modal.remove();
    })
}]);