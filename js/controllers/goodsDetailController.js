/**
 * Created by chaoshen on 2016/12/26.
 */

angular.module('cftApp.goodsDetail',[]).config(['$stateProvider',function ($stateProvider) {
    $stateProvider.state('tabs.goodsDetail',{
        url:'/goodsDetail/:is_integral/:goods_id/:goods_icon',
        views: {
            'tabs-homePage':{
                templateUrl:'goodsDetail.html',
                controller:'goodsDetailController'
            }
            // params: {
            //     is_integral: '',
            //     goods_id: 0,
            //     goods_icon: ''
            // }
        }
        
    });
}]).controller('goodsDetailController',['$scope','$ionicScrollDelegate','$stateParams','$state','$ionicViewSwitcher','$ionicModal','HttpFactory','$rootScope','$ionicLoading',function ($scope,$ionicScrollDelegate,$stateParams,$state,$ionicViewSwitcher,$ionicModal,HttpFactory,$rootScope,$ionicLoading) {
    console.log($stateParams);
    var goodsObj = $scope.goodsObj = {
        is_integral: 0,
        goods_id: $stateParams.goods_id,
        collectName: "收藏",
        //是否收藏
        isCollect: false,
        //详情是否激活
        isInfoActive: true,
        //参数是否激活
        isParamActive: false,
        //评论是否激活
        isAssessActive: false,
        IconRootURL: '',
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
        goShoppingCar: goShoppingCar,// 选中 购物车
        putinShoppingCar: putinShoppingCar, // 选中 加入购物车
        buyNow: buyNowOption, // 选中 立即购买
        backHome: backHome //返回 首页
        // convertOption: convertOption
        
    };
    
    $scope.$on('$ionicView.beforeEnter', function () {
        $rootScope.hideTabs = true;
    });
    setTimeout(function () {
        var params = {
            integral: '0',
            id: goodsObj.goods_id
        };
        HttpFactory.getData("/api/getGoods",params).then(function (result) {

            goodsObj.slideData.bannerData = result["good_introduction"];
            goodsObj.goodsData = result;
            console.log(result);
            if (goodsObj.goodsData.is_coll == 1){
                $scope.goodsObj.isCollect = true;
                $scope.goodsObj.collectName = "已收藏";
            }
        },function (err) {
            throw new Error("enter goods detail error: "+err);
        });
    },300);

    //点击收藏按钮执行的方法
    function collectionOption(goods_id) {
        $scope.goodsObj.isCollect = !$scope.goodsObj.isCollect;
        if ($scope.goodsObj.isCollect){
            console.log(goods_id);
            $scope.goodsObj.collectName = "已收藏";
            var collectParams = {
                goods_id: goods_id,
                is_integral: "0",
                sessid:SESSID
            };
            HttpFactory.getData("/api/ucollection",collectParams,"POST").then(function (result) {
                console.log(result);
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
                is_integral: "0",
                sessid:SESSID
            };
            HttpFactory.getData("/api/ucollection",noCollectParams,"DELETE").then(function (result) {
                console.log(result);
                if (result.status == 0) {
                    $scope.popTipsShow("已取消收藏");
                }
                if (result.status !== 0) {
                    $scope.popTipsShow(result.desc);
                }
            },function (err) {
                throw new Error("enter goods detail error: "+err);
            });
        }
    }
    function backHome() {
        console.log('hh');
        $state.go('tabs.homePage');
        
    }
    function changeGoodsNums() {
        $scope.openModal();
    }
    
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
        // tabs.shoppingCart
        // $state.go("tabs.shoppingCart");
        // $ionicViewSwitcher.nextDirection('forward');
    }
    $ionicModal.fromTemplateUrl('shopCarModal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal;
    });
    $scope.openModal = function() {
        $scope.modal.show();
    };
    
    //当我们用到模型时，清除它！
    $scope.$on('$destroy', function() {
        $scope.modal.remove();
    });
    function putinShoppingCar() {
        $scope.openModal();
    }
    //立即购买
    function buyNowOption() {
        console.log({goodsArray:[goodsObj.goodsData]});
        $state.go("tabs.confirmOrder",{goodsArray:[goodsObj.goodsData]});
        $ionicViewSwitcher.nextDirection('forward');
    }
    //购物车模态窗口相关操作
    $scope.collect = {
        val : 1,
        reduce:function () {
            if($scope.collect.val > 1){
                $scope.collect.val--;
            }
        },
        add:function () {
            $scope.collect.val ++;
        }
    };
    //点击数量打开加入购物车和立即购买的modal
    $ionicModal.fromTemplateUrl('shopCarModal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal;
        
    });
    $scope.openModal = function() {
        $scope.modal.show();
        $scope.modal.goodsData = goodsObj.goodsData;
        $scope.modal.goodsData.goods_name = goodsObj.goodsData.goods_brief;
        $scope.modal.goodsData.goods_introduction = $stateParams.goods_icon;
        $scope.modal.IconRootURL = IconROOT_URL;
    };
//点击模态窗口的加入购物车触发的方法
    $scope.addToShoppingCar = function () {
        console.log($scope.modal.goodsData);
        var params = {
            goods_id: $scope.modal.goodsData.goods_id,
            num:$scope.collect.val,
            sessid:SESSID
        };
        HttpFactory.getData("/api/ushoppingCart",params,"POST").then(function (result) {
            console.log(result);
            if (result.status == 0) {
                console.log('加入购物车成功');
                $scope.modal.hide();
                $scope.popTipsShow("加入购物车成功");
            }else {
                console.log("加入购物车不成功");
                console.log(result);
                $scope.popTipsShow("加入购物车失败");
            }
        },function (err) {
            console.log(err);
        });
    };
    //立即购买
    $scope.goToConfirmOrder = function () {
        console.log({goodsArray:[$scope.modal.goodsData]});
        $scope.modal.hide();
        $state.go("tabs.confirmOrder",{goodsArray:[$scope.modal.goodsData]});
        $ionicViewSwitcher.nextDirection('forward');
    };


    $scope.rednums = [];
    $scope.graynums = [];
    (function showStarNums(nums) {
        $scope.rednums.length = nums;
        $scope.graynums.length = 5-nums;
    }(5));
    $scope.goodsIcons = ['img1'];
    
    // function convertOption() {
    //     console.log("立即兑换");
    // }
    //
}]);