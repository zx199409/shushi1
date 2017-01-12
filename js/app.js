/**
 * Created by qingyun on 16/11/30.
 */
//js程序入口
angular.module('cftApp',['ionic','cftApp.storageFactory','cftApp.tabs','cftApp.httpFactory','cftApp.slideBox','ctfApp.searchBar','cftApp.homePage','cftApp.integralStore','cftApp.napaStores','cftApp.personal','cftApp.goodsDetail','cftApp.collection','cftApp.myOrder','cftApp.receiptAddress','cftApp.shoppingCart','cftApp.totalScore','cftApp.payRecord','cftApp.integralGoodsDetail','cftApp.integralGoodsDetail','cftApp.sortedGoods','cftApp.sortedIntegral','RongWebIMWidget','cftApp.confirmOrder'])
    .config(['$stateProvider','$urlRouterProvider','$ionicConfigProvider',function ($stateProvider,$urlRouterProvider,$ionicConfigProvider) {
        $ionicConfigProvider.tabs.position('bottom');
        $ionicConfigProvider.tabs.style('standard');
        $ionicConfigProvider.navBar.alignTitle('center');
        // $ionicConfigProvider.templates.maxPrefetch(0);
        // $ionicConfigProvider.views.maxCache(0);
        $stateProvider.state("tabs",{
            url:"/tabs",
            abstract:true,
            templateUrl:"tabs.html",
            controller:'tabsController'
        });
        //意外跳转
        $urlRouterProvider.otherwise('tabs/homePage');
}]);
var ROOT_URL = "http://114.112.94.166/sunny/wap",
    perPageCount = 10,
    IconROOT_URL = "http://114.112.94.166",
    SESSID = "10";


    