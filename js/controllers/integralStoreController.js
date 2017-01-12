/**
 * Created by qingyun on 16/11/30.
 */
angular.module('cftApp.integralStore',['ctfApp.searchBar','cftApp.goodsDetail']).config(['$stateProvider',function ($stateProvider) {
    $stateProvider.state('tabs.integralStore',{
        
        url:'/integralStore',
        views:{
            'tabs-integralStore':{
                
                templateUrl:'integralStore.html',
                controller:'integralStoreController'
            }
        }
    });
}]).controller('integralStoreController',['$scope','$rootScope','$ionicPopup','HttpFactory','$ionicSideMenuDelegate','$state','$ionicNavBarDelegate','$ionicViewSwitcher',function ($scope,$rootScope,$ionicPopup,HttpFactory,$ionicSideMenuDelegate,$state,$ionicNavBarDelegate,$ionicViewSwitcher) {
    
    var integralObj = $scope.integralObj = {
        goodsData:[],
        slideData: {
            bannerData: [],
            ishome: 1
        },
        cateData: {}, //通过tab 获得侧边栏数据
        moredata: false, //是否加载更多
        currentpage: 0, //当前页数
        toggleRight: toggleRight,//切换侧边栏
        goDetail: goDetail, //进入商品详情页
        doRefresh: doRefresh, //下拉刷新
        loadMore: loadMore, //加载更多
        goSearch: goSearch, //进行搜索
        convertOption: convertOption //兑换
        
    };
    
    // 跳转 积分分类
    $scope.$on('integral_sortedView',function (event,data) {
        setTimeout(function () {
            $state.go("tabs.sortedIntegral",{searchStr:'',cate_id: data});
            $ionicViewSwitcher.nextDirection('forward');
        },300);
    });
    $scope.$on('$ionicView.beforeEnter', function () {
        $rootScope.hideTabs = false;
    });
    var params = {
        total: perPageCount, //每页多少条数据
        page: integralObj.currentpage, // 当前页
        integral: 1, //integral
        bannum: 5 //默认5条
        
    };
    //搜索
    
    function goSearch(searchStr) {
        $state.go('tabs.sortedIntegral',{searchStr: searchStr});
        $rootScope.hideTabs = true;
        $ionicViewSwitcher.nextDirection('forward');
    }
    //侧栏菜单按钮
    function toggleRight() {
        //打开侧边栏时的一些默认数据，赋值 tab
        $scope.sideMenuObj.sideMenuOnOpened(1,0,integralObj.cateData);
        $ionicSideMenuDelegate.toggleRight();
    }
    
    
    //进入详情
    function goDetail(item) {
        $rootScope.hideTabs = true;
        $state.go('tabs.igDetail',{is_integral: "1", goods_id: item.goods_id});
        $ionicViewSwitcher.nextDirection('forward');
    }
    //加入购物车
    //加入购物车的模态窗口
    
    //下拉刷新
    function doRefresh() {
        integralObj.currentpage = 1;
        params.page = integralObj.currentpage;
        integralObj.moredata = false;
        HttpFactory.getData("/api/getGoods",params)
            .then(function (result) {
                console.log(result);
                $scope.$broadcast("homeSlideData",integralObj.slideData);
                integralObj.goodsDatas = result["goodsData"];
                integralObj.cateData = result["cateData"];
                $scope.$broadcast('scroll.refreshComplete');
            },function (err) {
                console.log(err);
            });
    }
    
    function loadMore() {
        integralObj.currentpage += 1;
        params.page = integralObj.currentpage;
        HttpFactory.getData("/api/getGoods",params).then(function (result) {
            console.log(result["goodsData"]);
            if (result["goodsData"].length < perPageCount) {
                integralObj.moredata = true;
            }
            if (integralObj.currentpage == 1){
                $scope.sideMenuObj.sortedSecondClassObj = result["cateData"];
                integralObj.slideData.bannerData = result["bannerData"];
                console.log("result");
                console.log(result);
            }
            console.log(result);
            integralObj.goodsData = integralObj.goodsData.concat(result.goodsData);
            console.log(integralObj.goodsData);
            $scope.$broadcast('scroll.infiniteScrollComplete');
            
        },function (err) {
            console.log(err);
        });
        console.log("加载更多");
    }
    function convertOption(event) {
        console.log("兑换");
        event.stopPropagation();
        
    }
}]);