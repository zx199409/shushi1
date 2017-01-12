/**
/**
 * Created by qingyun on 16/11/30.
 */
angular.module('cftApp.homePage',[]).config(['$stateProvider',function ($stateProvider) {
    $stateProvider.state('tabs.homePage',{
        url:'/homePage',
        views:{
            'tabs-homePage':{
                templateUrl:'homePage.html',
                controller:'homePageController'
            }
        }
    });
}]).controller('homePageController',['$scope','$rootScope','$ionicPopup','HttpFactory','$ionicSideMenuDelegate','$state','$ionicNavBarDelegate','$ionicViewSwitcher','RongCustomerService','$ionicModal',function ($scope,$rootScope,$ionicPopup,HttpFactory,$ionicSideMenuDelegate,$state,$ionicNavBarDelegate,$ionicViewSwitcher,RongCustomerService,$ionicModal) {
    
/*
    RongCustomerService.init({
        appkey:"z3v5yqkbz34q0",
        token:"LrtuJJc5FG8Zw6s3ObhfVrqb5K8F0ZkLd/XlQVwx5gy3aWJqZ8ki58J3gpjJwzMOVll1nVYsf/DVBj3A5mmVhg==",
        customerServiceId:"KEFU148280845240702",
        position:RongCustomerService.Position.right,
        reminder:" ",
        // displayConversationList:false,
        style:{
            width:document.body.clientWidth,
            height:document.body.clientHeight,
            displayMinButton:false,
            positionFixed:true
        },
        onSuccess:function(){

            //初始化完成
            //显示按钮
            var rongWidget = angular.element(document.getElementsByTagName('rong-widget'));
            rongWidget.css('display','');
            //设置客服按钮位置
            var kf = angular.element(document.getElementById('rong-widget-minbtn'));
            kf.css('bottom','80px');
            kf.css('right','20px');
            var rongSendBtn = angular.element(document.getElementById('rong-sendBtn'));
            rongSendBtn.css('backgroundColor','#E60012');
            kf.on('click',function () {

            });

            var minBtn = angular.element(document.getElementById('header').childNodes[1].childNodes[1]);
            minBtn.on('click',function () {
                // $rootScope.hideTabs = false;
                // $state.reload();
            });
            // WebIMWidget.onClose = function() {
            //     // $rootScope.hideTabs = false;
            //     $state.reload();
            // };


        },
        onError:function(){
            //初始化错误
        }
    });

    */


    //搜索
   var homeObj = $scope.homeObj = {
       integral: 0,
       slideData: {
           bannerData: [],
           ishome: 0
       },
       cateData: {}, //通过tab 获得侧边栏数据
       currentpage: 0, //当前页数
       sideObj: {},
       goodsDatas: [], //商品数据
       moredata: false, //是否加载更多
       noneOfMoreData: false,
       toggleRight: toggleRight,//切换侧边栏
       goDetail: goDetail, //进入商品详情页
       takeShorpping: takeShorpping, //加入购物车
       doRefresh: doRefresh, //下拉刷新
       loadMore: loadMore, //加载更多
       goSearch: goSearch //进行搜索
    };

    var params = {
        total: perPageCount, //每页多少条数据
        page: homeObj.currentpage, // 当前页
        integral: 0, //home
        bannum: 5 //默认5条

    };

    //搜索

    function goSearch(searchStr) {
        console.log("首页搜索: "+searchStr);
        $state.go('tabs.sortedGoods',{searchStr: searchStr});
        $rootScope.hideTabs = true;
        $scope.sideMenuObj.isSearch = true;
        $ionicViewSwitcher.nextDirection('forward');
    }
    //首页跳转全部商品分类
    $scope.$on("home_sortedView",function (event,data) {
        setTimeout(function () {
            $state.go("tabs.sortedGoods",{searchStr:'',cate_id: data});
            $ionicViewSwitcher.nextDirection('forward');
        },300)
    });
    $scope.$on('$ionicView.beforeEnter', function () {
        $rootScope.hideTabs = false;
    });


    //侧栏菜单按钮
    function toggleRight() {
        $scope.sideMenuObj.sideMenuOnOpened(0,0);
        $ionicSideMenuDelegate.toggleRight();
    }

    //进入详情
    function goDetail(item) {
        // $rootScope.hideTabs = true;

        $state.go('tabs.goodsDetail',{is_integral: "0", goods_id: item.goods_id,goods_icon: item['goods_introduction']});
        $ionicViewSwitcher.nextDirection('forward');
    }
    //加入购物车
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
    //加入购物车的模态窗口
    $ionicModal.fromTemplateUrl('shopCarModal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal;
    });
    $scope.openModal = function() {
        //每次打开模态窗口都要清空数量
        $scope.collect.val = 1;
        $scope.modal.show();
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
    //当我们用到模型时，清除它！
    $scope.$on('$destroy', function() {
        $scope.modal.remove();
    });
    function takeShorpping($event,item) {
        $event.stopPropagation();
        $scope.openModal();
        console.log(item);
        $scope.modal.goodsData = item;
        $scope.modal.IconRootURL = IconROOT_URL;
        // console.log("点击购物车");
    }
    //下拉刷新
    function doRefresh() {
        homeObj.currentpage = 1;
        params.page = homeObj.currentpage;
        homeObj.moredata = false;

        var getData = {
            success: function (result) {

                homeObj.slideData.bannerData = result["bannerData"];
                homeObj.goodsDatas = result["goodsData"];
                $scope.sideMenuObj.sortedSecondClassObj = result["cateData"];
                $scope.$broadcast('scroll.refreshComplete');

            },
            error: function (err) {
                console.log(err);
            }
        };
        HttpFactory.getData("/api/getGoods",params)
            .then(
                getData.success,
                getData.error);
    }

    function loadMore() {

        homeObj.currentpage += 1;
        params.page = homeObj.currentpage;

        var loadMoreData = {
            success: function (result) {

                if (result.status == 0) {
                    if (result["goodsData"].length < perPageCount)
                    {
                        homeObj.moredata = true;
                        homeObj.noneOfMoreData = true;
                    }else {
                        homeObj.noneOfMoreData = false;
                    }
                    if (homeObj.currentpage == 1)
                    {
                        console.log(result);
                        $scope.sideMenuObj.sortedSecondClassObj = result["cateData"];
                        homeObj.slideData.bannerData = result["bannerData"];
                    }
                    homeObj.goodsDatas = homeObj.goodsDatas.concat(result["goodsData"]);
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                }else {
                    console.log("请求出错");
                }

            },
            error: function (err) {
                console.log(err);
            }
        };
        HttpFactory.getData("/api/getGoods",params)
            .then(
                loadMoreData.success,
                loadMoreData.error);
    }

}]);