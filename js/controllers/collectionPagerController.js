/**
 * Created by lx on 2016/12/9.
 */
angular.module('cftApp.collection',['ionic']).config(['$stateProvider',function ($stateProvider) {
    $stateProvider.state('tabs.collectionPager',{
        cache:false,
        url:'/collectionPager',
        views:{
            'tabs-personal':{
                templateUrl:'collectionPager.html',
                controller:"collectionPagerController"
            }
        }
      });
}]).controller('collectionPagerController',['$scope','$ionicModal','HttpFactory','$rootScope','$ionicPopup','$state','$ionicViewSwitcher',function ($scope,$ionicModal,HttpFactory,$rootScope,$ionicPopup,$state,$ionicViewSwitcher) {
    //隐藏 tabs
    $scope.$on('$ionicView.beforeEnter', function () {
        $rootScope.hideTabs = true;
    });
    $scope.collect = {
        iconRootUrl: '',
        collectionData: [],
        //删除商品
        deleteCollect:deleteCollect,

        //膜态 窗口里面的
        //用户点击商品购买的数量
        val : 1,
        //减少商品数量
        reduce:reduce,
        //增加商品数量
        add:add,
        loadCollectionsData: loadCollectionsData,
        //下拉刷新
        doRefresh:doRefresh,
        //上拉加载

        loadMore:loadMore,

        isShowInfinite:true

    };
    //下拉刷新

    var index =-1;

       function doRefresh() {
             index = 0;
           loadCollectionsData('下拉');
           $scope.$broadcast('scroll.refreshComplete');
           $scope.collect.isShowInfinite = true;
       }


           function loadMore() {
               index +=1;
               console.log('上拉加载....');
               loadCollectionsData('上拉');


           }



    $scope.collect.IconROOT_URL = IconROOT_URL;

    function loadCollectionsData(changeState) {
        var url = "/api/ucollection";
        console.log(url);
        var params = {
            page:index,
            sessid:SESSID
        };
        HttpFactory.getData(url,params)
            .then(function (result) {
                console.log("请求收藏列表");
                // console.log(result.collectionData.length);
                 if(changeState=="下拉"){
                     $scope.collect.collectionData =result.collectionData;
                     // console.log(index);

                 }else if(changeState=="上拉" && result.collectionData.length!=0){
                     $scope.collect.collectionData =  $scope.collect.collectionData.concat(result.collectionData);
                     // console.log(index);
                 }else if(result.collectionData.length==0){
                     $scope.collect.isShowInfinite = false;

                 }

                if ($scope.collect.collectionData.length < 8){
                    $scope.collect.isShowInfinite = false;
                }else {

                    $scope.$broadcast('scroll.infiniteScrollComplete');
                }
                console.log($scope.collect.collectionData);
            },function (err) {
                console.log(err);
                $scope.collect.isShowInfinite = false;
            });
    }


    function deleteCollect(event,item,index){
        console.log(item);
      $ionicPopup.show({
             cssClass:'myOrder',
            template:'确认要删除吗?',
            scope: $scope,
            buttons: [
                { text: '取消',
                    onTap:function () {

                    }
                },
                {
                    text: '确定',
                    onTap: function(e) {

                        var params = {
                            id: item["id"]

                        };
                        HttpFactory.getData("/api/ucollection",params,"DELETE")
                            .then(function (result) {
                                console.log(result);
                                if (result.status == 0) {
                                    $scope.popTipsShow('删除成功');
                                    $scope.collect.collectionData.splice(index,1);
                                    // loadCollectionsData();
                                }else {
                                    $scope.popTipsShow("删除失败");
                                    console.log(result)
                                }
                            },function (err) {
                                console.log(err);
                            });
                    }
                }
            ]
        });
        event.stopPropagation();
    }

   


    //模态窗口的操作

    //加入购物车的模态窗口
    $ionicModal.fromTemplateUrl('shopCarModal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal;
    });
    $scope.shopCardShow = function(index) {
        $scope.modal.show();
        console.log($scope.collect.collectionData[index]);
        //用在加入购物车模态窗口详情的商品内容
        $scope.goods = $scope.collect.collectionData[index];
        //模态窗口的图片地址前缀
        $scope.modal.IconRootURL =  IconROOT_URL;
        $scope.modal.goodsData = {
            goods_introduction: $scope.collect.collectionData[index].litpic,
            goods_name:$scope.collect.collectionData[index].title,
            shop_price:$scope.collect.collectionData[index].price
        };
    };

    //当我们用到模型时，清除它！
    $scope.$on('$destroy', function() {
        $scope.modal.remove();
    });


    $scope.addToShoppingCar =function () {
        var params = {
            goods_id: $scope.goods.g_id,
            sessid:SESSID
        };
        HttpFactory.getData("/api/ushoppingCart",params,"POST")
            .then(function (result) {
                console.log(result);
                if (result.status == 0) {
                    $scope.modal.hide();
                    //加入购物车成功然后再收藏页面把该商品删除
                    $scope.collect.collectionData.splice(index,1);
                    console.log('加入购物车成功');
                    $scope.popTipsShow("加入购物车成功");
                }else {
                    console.log("加入购物车不成功");
                    $scope.popTipsShow("加入购物车失败");
                    console.log(result);

                }
            },function (err) {
                console.log(err);
            });
    };
    //立即购买
    $scope.goToConfirmOrder = function () {
        console.log({goodsArray:[$scope.goods]});
        $scope.modal.hide();
        $state.go("tabs.confirmOrder",{goodsArray:[$scope.goods]});
        $ionicViewSwitcher.nextDirection('enter');
    };
    function reduce() {
        if($scope.collect.val>1){
            $scope.collect.val--;
        }
        //让最少为一件
    }
    function  add () {
        $scope.collect.val ++;
    }

}]);