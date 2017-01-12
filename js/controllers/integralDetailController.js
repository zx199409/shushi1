/**
 * Created by chaoshen on 2016/12/16.
 */
angular.module('cftApp.integralGoodsDetail',[]).config(['$stateProvider',function ($stateProvider) {
    $stateProvider.state('tabs.igDetail',{
        url:'/igDetail/:is_integral/:goods_id',
        // params: {
        //     is_integral: 1,
        //     goods_id: 0
        // },
        views: {
            'tabs-integralStore':{
                templateUrl:'goodsDetail.html',
                controller:'integralDetailController'
            }
        }
        
    });
}]).controller('integralDetailController',['$scope','$ionicScrollDelegate','$state','$stateParams','$ionicModal','HttpFactory','$rootScope','$ionicLoading',function ($scope,$ionicScrollDelegate,$stateParams,$state,$ionicModal,HttpFactory,$rootScope,$ionicLoading) {
    var goodsObj = $scope.goodsObj = {
        is_integral: "1",
        collectName: "收藏",
        isCollect: false,
        isInfoActive: true,
        isParamActive: false,
        isAssessActive: false,
        selection: 'goodsInfo',//视图切换
        goodsData: {},
        slideData: {
            bannerData: [],
            ishome: 2 //这里用于区分首页和积分首页的0 和 1，用于标示不能被点击
        },
        collectOption: collectionOption,//收藏
        changeGoodsNums: changeGoodsNums,//商品数量
        selectInfo: selectInfo,//选中 商品详情
        selectParam: selectParam,//选中 商品参数
        selectAssess: selectAssess,// 选中 商品评价
        // goShoppingCar: goShoppingCar,// 选中 购物车
        // putinShoppingCar: putinShoppingCar, // 选中 加入购物车
        // buyNow: buyNowOption, // 选中 立即购买
        backHome: backHome, //返回 首页
        //立即兑换
        convertOption: convertOption
        
    };
    $scope.$on('$ionicView.beforeEnter', function () {
        $rootScope.hideTabs = true;
    });
    
    var params = {
        integral: goodsObj.integral,
        id: $stateParams.params.goods_id
    };
    setTimeout(function () {
        console.log(params);
        HttpFactory.getData("/api/getGoods",params).then(function (result) {
            console.log(result);
            goodsObj.slideData.bannerData = result["good_introduction"];
            goodsObj.goodsData = result;
            if (goodsObj.goodsData.is_coll == 1){
                $scope.goodsObj.isCollect = true;
                $scope.goodsObj.collectName = "已收藏";
            }
        },function (err) {
            throw new Error("enter goods detail error: "+err);
        });
    },300);
    
    function collectionOption(goods_id) {
        $scope.goodsObj.isCollect = !$scope.goodsObj.isCollect;
        if ($scope.goodsObj.isCollect){
            console.log(goods_id);
            $scope.goodsObj.collectName = "已收藏";
            var collectParams = {
                goods_id: goods_id,
                is_integral: "1",
                sessid:SESSID
            };
            HttpFactory.getData("/api/ucollection",collectParams,"POST")
                .then(function (result) {
                    if (result.status == 0) {
                        $scope.popTipsShow("收藏成功");
                    }
                },function (err) {
                    throw new Error("enter goods detail error: "+err);
                });
        }else {
            console.log("取消收藏");
            $scope.goodsObj.collectName = "收藏";
            var noCollectParams = {
                goods_id: goods_id,
                is_integral: "1",
                sessid:SESSID
            };
            HttpFactory.getData("/api/ucollection",noCollectParams,"DELETE")
                .then(function (result) {

                    if (result.status == 0) {
                        $scope.popTipsShow("已取消收藏");
                    }else {
                        $scope.popTipsShow(result.desc)
                    }
                },function (err) {
                    throw new Error("enter goods detail error: "+err);
                });
        }
    }

    function backHome() {
        console.log('hh');
        localStorage.isFromIntegralToHomePage = true;
        $state.go('tabs.homePage');
        
        // $ionicViewSwitcher.nextDirection('back');
    }
    function changeGoodsNums() {
        console.log("改变商品数量");
    }
    
    $scope.isInteg = $stateParams.params.isInteg;
    var slideLine = document.getElementById('slideLine');
    
    function selectInfo() {
        $ionicScrollDelegate.resize();
        console.log("选中商品详情");
        $scope.goodsObj.isInfoActive = true;
        $scope.goodsObj.isParamActive = false;
        $scope.goodsObj.isAssessActive = false;
        slideLine.style.left = "4.7%";
        $scope.goodsObj.selection='goodsInfo';
    }
    function selectParam() {
        $ionicScrollDelegate.resize();
        console.log("选中商品参数");
        $scope.goodsObj.isInfoActive = false;
        $scope.goodsObj.isAssessActive = false;
        $scope.goodsObj.isParamActive = true;
        slideLine.style.left = "38%";
        $scope.goodsObj.selection='goodsParam';
        
    }
    function selectAssess() {
        $ionicScrollDelegate.resize();
        console.log("选中商品评价");
        $scope.goodsObj.isInfoActive = false;
        $scope.goodsObj.isParamActive = false;
        $scope.goodsObj.isAssessActive = true;
        slideLine.style.left = "71.4%";
        $scope.goodsObj.selection='goodsAssess';
    }
    
    function goShoppingCar() {
        console.log("点击购物车");

    }
    function putinShoppingCar() {
        console.log("加入购物车");
        $scope.openModal();
    }
    
    
    function buyNowOption() {
        console.log('立即购买');
        console.log(1111);
    }
    
    $scope.rednums = [];
    $scope.graynums = [];
    (function showStarNums(nums) {
        $scope.rednums.length = nums;
        $scope.graynums.length = 5-nums;
    }(5));
    $scope.goodsIcons = ['img1'];
    
    function convertOption() {
        console.log("立即兑换");
    }
    
}]);