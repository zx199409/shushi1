/**
 * Created by lx on 2016/12/9.
 */
angular.module('cftApp.shoppingCart',['ionic']).config(['$stateProvider',function ($stateProvider) {
    $stateProvider.state('tabs.shoppingCart',{
        url:'/shoppingCart',
        views:{
            'tabs-personal':{
                templateUrl:'shoppingCart.html',
                controller:'shoppingCartController'
            }
        }
    });
}]).controller('shoppingCartController',['$scope','$rootScope','$state','$ionicPopup','HttpFactory',function ($scope,$rootScope,$state,$ionicPopup,HttpFactory) {
    $scope.$on('$ionicView.beforeEnter', function () {
        $rootScope.hideTabs = true;
    });

    // 收到数据

    $scope.shoppingCart = {
        CartList : [] ,  //购物车列表
        CartMoney : 0 ,  //购物车总金额
        CartCount : 0 ,  //购物车数量
        isShowInfinite : true ,
        SelectAll:true,  //控制全选按钮红点 刚进去的时候默认不全选
        loadMore:loadMore ,  //上拉加载
        doRefresh:doRefresh,   //下拉刷新
        confirmDelete:confirmDelete,  //确认删除
        ifSelectAll:ifSelectAll,  //全选按钮判断
        ifSelect:ifSelect  //选择购物车商品并计算总金额 判断全选按钮是否显示
    };
    var more = -1;

    // 上拉加载函数
    function loadMore() {
        console.log('上拉加载');
        // alert(222);
        more +=1;
        var shoppingCartUrl = '/api/ushoppingCart';
        var params = {
            page:more,
            sessid:SESSID
        };
        HttpFactory.getData(shoppingCartUrl,params).then(function (result) {
            if (result.shoppingCart.length < 10){
                $scope.shoppingCart.isShowInfinite = false;
            }else {
                $scope.shoppingCart.isShowInfinite = true;
            }
            $scope.shoppingCart.CartList = $scope.shoppingCart.CartList.concat(result.shoppingCart);
            goodsIfOutData();
        },function (err) {
            $scope.shoppingCart.isShowInfinite = false;
        }).finally(function () {
            $scope.$broadcast('scroll.infiniteScrollComplete');
        });
    }

    // 下拉刷新函数
    function doRefresh() {
        console.log('下拉刷新');
        more = 0;
        var shoppingCartUrl = '/api/ushoppingCart';
        var params = {
            page:more,
            sessid:SESSID
        };
        HttpFactory.getData(shoppingCartUrl,params)
            .then(function (result) {
                if (result.shoppingCart.length >= 10){
                    $scope.shoppingCart.isShowInfinite = true;
                }
                $scope.shoppingCart.CartList = result.shoppingCart;
                goodsIfOutData();
            }).finally(function () {
            $scope.$broadcast('scroll.refreshComplete');
        });
        $scope.shoppingCart.SelectAll = true;
        $scope.shoppingCart.CartMoney = 0;
        $scope.shoppingCart.CartCount = 0;

    }


    // 判断是否失效
    function goodsIfOutData() {
        var nowTime = new Date().getTime();
        for (var s = 0;s<$scope.shoppingCart.CartList.length;s++){
            if (($scope.shoppingCart.CartList[s].addTime - nowTime)/(1000*60*60*24) >30 ){
                $scope.shoppingCart.CartList[s].isHave = false;
            }else {
                $scope.shoppingCart.CartList[s].isHave = true;
            }
        }
    }

    // 计算总价格和总数量
    function shoppingCartallMoney() {
        var shoppingMoney = 0;
        var shoppingCartCount = 0;
        // 选中所有的label标签里的input标签
        var shoppingCheckbox = document.querySelectorAll('.radio>input');
        // console.log(shoppingCheckbox);
        for (var p = 0; p < shoppingCheckbox.length; p++) {
            if (shoppingCheckbox[p].checked == true){
                shoppingMoney += $scope.shoppingCart.CartList[p].price * $scope.shoppingCart.CartList[p].num;
                shoppingCartCount += Number($scope.shoppingCart.CartList[p].num);
            }
            // console.log(shoppingMoney);
        }
        $scope.shoppingCart.CartMoney = shoppingMoney;
        $scope.shoppingCart.CartCount = shoppingCartCount;
    }



    // 全选按钮判断
    function ifSelectAll() {
        $scope.shoppingCart.SelectAll = !$scope.shoppingCart.SelectAll;
        // 选中所有的label标签里的input标签
        var shoppingCheckbox = angular.element(document.querySelectorAll('.radio>input'));
        if (!$scope.shoppingCart.SelectAll) {
            shoppingCheckbox.attr('checked','true');
        }
        // 如果取消全选的话让所有商品都取消选中
        else{
            shoppingCheckbox.attr('checked','');
        }
        shoppingCartallMoney();
    }

    // 选择购物车商品并计算总金额 判断全选按钮是否显示
    function ifSelect() {
        shoppingCartallMoney();
        $scope.shoppingCart.SelectAll = true;
        // 判断当所有商品都选中时全选按钮也要被选中
        var shoppingCheckbox = document.querySelectorAll('.radio>input');
        var ifArray = [];
        for (var q = 0;q<shoppingCheckbox.length;q++){
            ifArray = ifArray.concat(shoppingCheckbox[q].checked);
        }
        var arr;
        for(var o = 0;o < ifArray.length;o++){
            arr += ifArray[o]+'';
        }
        arr.indexOf('false');
        $scope.shoppingCart.SelectAll = arr.indexOf('false') > 0;
    }


    // 前往商品详情
    $scope.lookGoodDetail = function () {
        alert('前往商品详情！')
    };

    // 删除商品
    function confirmDelete (index) {
        console.log('确认删除');
        $ionicPopup.show({
            cssClass:'myOrder',
            template:'确认要删除该商品吗？',
            buttons:[{
                text:'取消',
                type: 'button-clear button-dark',
                onTap:function () {

                }
            },{
                text:'确定',
                type: 'button-clear button-assertive',
                onTap:function (e) {
                    console.log($scope.shoppingCart.CartList[index]);
                    // return;
                    var params = {
                        id: $scope.shoppingCart.CartList[index].id,
                        sessid:SESSID
                    };
                    HttpFactory.getData("/api/ushoppingCart",params,"DELETE").then(function (result) {
                        console.log(result);
                        if (result.status == 0) {
                            var shoppingCheckbox = document.querySelectorAll('.radio>input');
                            shoppingCheckbox[index].checked = '';
                            shoppingCartallMoney();
                            $scope.shoppingCart.CartList.splice(index,1);
                            $scope.popTipsShow("删除成功");
                        }else {
                            $scope.popTipsShow("删除失败");
                        }
                    },function (err) {
                        console.log(err);
                        $scope.popTipsShow("网络错误");
                    });

                }
            }]
        });
    }




}]);