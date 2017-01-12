/**
 * Created by chaoshen on 2016/12/18.
 */
angular.module('cftApp.sortedGoods',[])
    .config(['$stateProvider',function ($stateProvider) {
        $stateProvider.state('tabs.sortedGoods',{
            cache: false,
            url: '/sortedGoods/?:sortname',
            params: {
                searchStr: '',
                cate_id: []
            },
            views: {
                'tabs-homePage': {
                    templateUrl: 'sortedGoods.html',
                    controller: "sortedGoodsController"
                }
            }

        })
    }])
    .controller('sortedGoodsController',['$scope','$stateParams','$state','$ionicSideMenuDelegate','HttpFactory','$ionicViewSwitcher','$ionicLoading','$ionicScrollDelegate',function ($scope,$stateParams,$state,$ionicSideMenuDelegate,HttpFactory,$ionicViewSwitcher,$ionicLoading,$ionicScrollDelegate) {
        
        var sortedGoodsObj = $scope.sortedGoodsObj = {
            tapNums : 0,
            isPriceHeigh : true,
            moredata: false,
            viewTitle : '',
            dataIsNull: false,
            sortWords : '',//排序关键字
            goodsDatas : [],//商品数据
            goDetail : goDetail,//进入详情页
            takeShorpping : takeShorpping,//点击购物车
            sortAction : sortAction,//排序方式
            goSearch : goSearch,
            doRefresh: doRefresh,
            loadMore: loadMore,
            currentPage: 0,
            arrowImg : "images/xiaoArrow.png"
            
        };
        // $scope.sortedGoodsObj.viewTitle = $stateParams.sortname;
        
        //作为整个页面的参数对象使用，利于刷新时的统一
        var params = {
            integral: 0,
            total : perPageCount,
            page : sortedGoodsObj.currentPage,
            searchStr : $stateParams.searchStr,
            cate_id : $stateParams.cate_id
        };
        
        //刷新
        function doRefresh() {
            if (params.searchStr == undefined){
                console.log("params=''");
                params.searchStr = "";
            }
            sortedGoodsObj.currentPage = 1;
            params.page = sortedGoodsObj.currentPage;
            sortedGoodsObj.moredata = false;
            HttpFactory.getData("/api/getGoods",params)
                .then(function (result) {
                    if (result.status == 0){
                        if(result["goodsData"].length == 0){
                            sortedGoodsObj.dataIsNull = true;
                        }else {
                            sortedGoodsObj.dataIsNull = false;
                        }
                        sortedGoodsObj.goodsDatas = result["goodsData"];
                    }
                    
                    $scope.$broadcast('scroll.refreshComplete');
                    
                },function (err) {
                    console.log(err);
                });
        }
        //加载更多
        
        function loadMore() {
            console.log(params);
            sortedGoodsObj.currentPage += 1;
            params.page = sortedGoodsObj.currentPage;
            
            if (sortedGoodsObj.currentPage == 1){
                setTimeout(function () {
                    var loadMoreData = {
                        success: function (result) {
                            console.log(result);
                            if (result["goodsData"].length < perPageCount){
                                sortedGoodsObj.moredata = true;
                            }
            
                            if (result["goodsData"].length == 0){
                                sortedGoodsObj.dataIsNull = true;
                            }else {
                                sortedGoodsObj.dataIsNull = false;
                            }
                            sortedGoodsObj.goodsDatas = sortedGoodsObj.goodsDatas.concat(result["goodsData"]);
                            $scope.$broadcast('scroll.infiniteScrollComplete');
                        },
                        error: function (err) {
                            console.log(err);
                        }
                    };
                    HttpFactory.getData("/api/getGoods",params)
                        .then(
                            loadMoreData.success,
                            loadMoreData.error);
                },300);
                return;
            }
            HttpFactory.getData("/api/getGoods",params)
                .then(function (result) {
                    console.log(result);
                    if (result["goodsData"].length < perPageCount){
                        sortedGoodsObj.moredata = true;
                    }
                    sortedGoodsObj.goodsDatas = sortedGoodsObj.goodsDatas.concat(result["goodsData"]);
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                },function (err) {
                    console.log(err);
                })
        }
        
        //进入商品详情页
        function goDetail(item) {
            $state.go('tabs.goodsDetail',{is_integral: 0,goods_id: item.goods_id});
            $ionicViewSwitcher.nextDirection('forward');
        }
        //当前页搜索
        function goSearch(searchStr) {
            
            if (searchStr == undefined){
                searchStr = "";
                
            }
            params.cate_id = [];
            params.startPrice = '';
            params.endPrice = '';
            params.searchStr = searchStr;
            $scope.sideMenuObj.isSearch  = true;
            sortedGoodsObj.goodsDatas = [];
            doRefresh();
        }
        //点击购物车
        function takeShorpping($event,item) {
            console.log("点击购物车");
        }
        //排序请求
        function requestSorted(paramsObj) {
            
            sortedGoodsObj.moredata = false;
            sortedGoodsObj.currentPage = 1;
            paramsObj.page = 1;
            console.log(paramsObj);
            HttpFactory.getData("/api/getGoods",paramsObj)
                .then(function (result) {
                    sortedGoodsObj.goodsDatas = result["goodsData"];
                    $ionicScrollDelegate.scrollTop();
                },function (err) {
                          
                });
        }
        //所有的排序行为
        function sortAction(event) {
            var actions = angular.element(event.currentTarget).children();
            var target = angular.element(event.target);
            
            switch (target.text()){
                case "综合":
                    {
                        // sortedGoodsObj.goodsDatas = [];
                    }break;

                case "销量":
                    {
                        // sortedGoodsObj.goodsDatas = [];
                    }break;

                case "价格":
                    {
                    
                        if (target.hasClass("active")){
                            $scope.sortedGoodsObj.tapNums ++;
                            if ($scope.sortedGoodsObj.tapNums > 0){
                                $scope.sortedGoodsObj.isPriceHeigh = !$scope.sortedGoodsObj.isPriceHeigh;
                                
                                if ($scope.sortedGoodsObj.isPriceHeigh){
                                    ascSorted();
                                }else {
                                    descSorted();
                                }
                            }
                        }else {
                            //初次点击价格按钮时
                            $scope.sortedGoodsObj.tapNums = 0;
                            if ($scope.sortedGoodsObj.isPriceHeigh){
                                ascSorted();
                            }else {
                                descSorted();
                            }
                        }
                    
                    }break;

                case "筛选": {
                    $scope.sideMenuObj.sideMenuOnOpened(0,1);
                    $ionicSideMenuDelegate.toggleRight();
                    
                }break;
            }
            function ascSorted() {
                sortedGoodsObj.goodsDatas = [];
                params.sfield = "shop_price";
                params.sort = "asc";
                requestSorted(params);
                $scope.sortedGoodsObj.keyWords = '-price';
                $scope.sortedGoodsObj.arrowImg = "images/xiaoArrow.png"
            }
            function descSorted() {
                sortedGoodsObj.goodsDatas = [];
                params.sfield = "shop_price";
                params.sort = "desc";
                
                requestSorted(params);
                $scope.sortedGoodsObj.keyWords = 'price';
                $scope.sortedGoodsObj.arrowImg = "images/shangArrow.png"
            }
            //这里是为了避免箭头图片作为点击对象
            if (target.toString().indexOf("Image")!=-1){
                if (target.parent().text() != "筛选"){
                    console.log("rr");
                    actions.removeClass("active");
                    target.parent().addClass("active");
                }
            }else if(target.text() == "筛选"){
                
            }else  {
                actions.removeClass("active");
                target.addClass("active");
            }
        }
        $scope.$on("sureSorted",function (event,data) {
            console.log("普通商品收到：");
            $scope.searchStr = '';
            console.log(data);
            sortedGoodsObj.currentPage = 1;
            params.cate_id = data["sortedSecondIds"];
            params.startPrice = data["minPrice"];
            params.endPrice = data["maxPrice"];
            params.searchStr = '';
            sortedGoodsObj.goodsDatas = [];
            console.log(params);
            var sortedRequest = {
                success: function (result) {
                    if (result.status == 0){
                        
                        if (result["goodsData"].length == 0)
                        {
                            sortedGoodsObj.dataIsNull = true;
                        }
                        else
                        {
                            sortedGoodsObj.dataIsNull = false;
                        }
                            
                        
                        sortedGoodsObj.goodsDatas = result["goodsData"];
                    }
                    console.log(result);
                },
                error: function (err) {
                    console.log(err);
                }
            };
            HttpFactory.getData("/api/getGoods",params)
                .then(
                    sortedRequest.success,
                    sortedRequest.error
                );
        });
        
    }]);